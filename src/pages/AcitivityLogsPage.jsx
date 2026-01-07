import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActivityLog, RTE } from "../components";
import { useForm } from "react-hook-form";
import parse from "html-react-parser";
import activityLogsService from "../appwrite/activityLogsService";
import { addPosts,addPost, removePost, updatePost } from "../features/postSlice";

function ActivityLogsPage() {
    const { register, handleSubmit, control,getValues,setValue,reset } = useForm({
        defaultValues: {
            date: new Date().toLocaleDateString("en-CA"),
            postId:undefined,
        },
    });
    

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.userData);
    const posts = useSelector((state) => state.post.posts);
    const [isEdit,setIsEdit] = useState(false)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!user?.$id) return;
            if (posts.length>0) return;
            setLoading(true);
            const response = await activityLogsService.getPosts(user.$id);
            console.log("response ",response.documents)
            if (response?.documents) {
                dispatch(addPosts(response.documents));
            }
            setLoading(false);
        };

        fetchPosts();
    }, []);

    const submitPost = async (data) => {
        if (!user?.$id) {
            alert("User not logged in.");
            return;
        }
        try {
            if(getValues("postId")){
                const updateResponse = await activityLogsService.updatePost({
                    ...data,
                    postId :getValues("postId"),userId: user.$id,
                });
                if (updateResponse) {
                    dispatch(updatePost({ id: getValues("postId"), updatedPost: updateResponse })); // Update Redux store
                }
                setValue("postId",undefined);
                setIsEdit(false)
            }else{
                const newPost = { ...data, userId: user.$id};
                const response = await activityLogsService.addPost(newPost);
                console.log(response);
                
                if (response) {
                    dispatch(addPost(response));
                }
            }

        } catch (error) {
            console.log(error.message);
        }

        reset();
    };

    const deletePost = async (postId) => {
        const response = await activityLogsService.removePost(postId);
        if (response) {
            dispatch(removePost(postId)); // Update Redux store
        }
    };

    const editPost = async (postId) => {
        const post = posts.find((post) => post.$id === postId);
        console.log("post",post);
        
        if(post){
            setValue("title",post.title)
            setValue("content",post.content)
            setValue('date',new Date(post.createdDate).toLocaleDateString("en-CA"))
            setValue("postId",postId)
        }
    };

    return (
        <div>
            <div className="w-full">
                <form onSubmit={handleSubmit(submitPost)} className="p-[25px]">
                    <div className="flex gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Enter your Title"
                            className="w-[52%] md:w-[70%] p-2 pl-5 border rounded-md bg-secondary-dark-bg border-none text-white font-semibold outline-none"
                            {...register("title", {
                                required: "Title is required",
                            })}
                        />
                        <input
                            type="date"
                            className="w-[43%] md:w-[30%] p-2 border rounded-md bg-secondary-dark-bg border-none text-white outline-none"
                            {...register("date", {
                                required: "Date is required",
                            })}
                        />
                    </div>
                    <div className="mb-4">
                        <RTE name="content" control={control} />
                    </div>
                    <button className="w-full bg-blue-950 text-blue-400 border border-blue-400 border-b-4 font-medium px-5 py-[10px] rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300">
                        {isEdit? "Update The Post":"Submit The Post"}
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <p className="text-center">Loading posts...</p>
                ) : (
                    posts.map((post) => (
                        <ActivityLog
                            key={post.$id}
                            title={post.title}
                            content={parse(post.content)}
                            date={new Date(post.createdDate).toLocaleDateString("en-CA")}
                            onDelete={() => deletePost(post.$id)}
                            onEdit={() => {
                                setIsEdit(true)
                                editPost(post.$id);
                            }}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default ActivityLogsPage;
