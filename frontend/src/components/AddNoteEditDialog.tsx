import { Button, Form, Modal } from "react-bootstrap";
import {Note} from "../models/note"
import { useForm } from "react-hook-form";
import TextInputField from "./form/TextInputField";

interface AddEditNoteDialogProps {
  noteToEdit?: Note,
  onDismiss: () => void,
  onNoteSaved: (note: Note) => void,
}

interface NoteInput {
  title: string;
  text: string;
}

const AddNoteDialog = ({noteToEdit, onDismiss, onNoteSaved}: AddEditNoteDialogProps) => {

  const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<NoteInput>({
    defaultValues: {
      title: noteToEdit?.title || "",
      text: noteToEdit?.text || "",
    }
  });

  const onSubmit = async (input: NoteInput) => {
    try {
      let noteResponse: Note;
  
      // If there is a note to edit, update it
      if (noteToEdit) {
        const res = await fetch(`/api/notes/update-note/${noteToEdit._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });
        const data = await res.json();
        noteResponse = data.updatedNote; // The updated note is returned
      } else {
        // If there's no note to edit, create a new one
        const res = await fetch('/api/notes/create-note', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });
        const data = await res.json();
        noteResponse = data.newNote; // The newly created note is returned
      }
  
      // Call the onNoteSaved function with the updated or new note
      onNoteSaved(noteResponse);
      
    } catch (error) {
      console.error(error);
      alert("Error creating or updating note");
    }
  };
  

  return (
    <Modal show onHide={onDismiss} onSubmit={handleSubmit(onSubmit)}>
      <Modal.Header closeButton>
          <Modal.Title>
            {noteToEdit ? "Edit note" : "Add note"}
          </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form id="addEditNoteForm">

        <TextInputField
        name="title"
        label="Title"
        type="text"
        placeholder="Title"
        register={register}
        registerOptions={{required: "Required"}}
        error={errors.title}
        />

         <TextInputField
         name="text"
         label="Text"
         as="textarea"
         rows={5}
         placeholder="Text"
         register={register}
          />
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
        type="submit"
        form="addEditNoteForm"
        disabled={isSubmitting}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddNoteDialog