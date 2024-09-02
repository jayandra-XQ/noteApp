import { Button, Form, Modal } from "react-bootstrap";
import {Note} from "../models/note"
import { useForm } from "react-hook-form";

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
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control 
            type="text" 
            placeholder="Enter title" 
            isInvalid={!!errors.title}
            {...register("title", { required: "Title is required" })}  
            />
            <Form.Control.Feedback type="invalid">
              {errors.title?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Text</Form.Label>
            <Form.Control 
            as="textarea" 
            rows={5} 
            placeholder="Enter text" 
            {...register("text", { required: "Text is required" })}
            />
          </Form.Group>
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