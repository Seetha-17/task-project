import React from 'react'
import { Controller } from 'react-hook-form'
import { Editor } from "@tinymce/tinymce-react"

function RTE({ name, control, defaultValue = "" }) {
  return (
    <div className='w-full'>
      <Controller
        name={name || 'content'}
        control={control}
        defaultValue={defaultValue} 
        render={({ field: { onChange,value } }) => (
          <Editor
            apiKey='ogqk7821psrnpfzser4g6ky5qqv3os9ymjdi1xoy7yw6rdth'
            value={value} // Bind the editor's value to the form state
            onEditorChange={(content) => {
              onChange(content); // Update the form state with the editor's content
            }}
            initialValue={defaultValue}
            init={{
              initialValue: defaultValue,
              height: 250,
              menubar: true,
              plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "anchor",
              ],
              toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
              skin: "oxide-dark", // Use the dark skin
              content_css: "dark",
              content_style: `
                body {
                  font-family:Helvetica,Arial,sans-serif;
                  font-size:17px;
                  background-color: #33373E; /* Change this to your desired color */
                  color: white; /* Text color */
                }
              `,
            }}
          />
        )}
      />
    </div>
  )
}

export default RTE