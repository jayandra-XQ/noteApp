import { Button, Form, Modal } from "react-bootstrap";
import {Note} from "../models/note"
import { useForm } from "react-hook-form";

interface AddNoteDialogProps {
  onDismiss: () => void,
  onNoteSaved: (note: Note) => void,
}

interface NoteInput {
  title: string;
  text: string;
}

const AddNoteDialog = ({onDismiss, onNoteSaved}: AddNoteDialogProps) => {

  const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<NoteInput>();

  const onSubmit = async (input: NoteInput) => {
    try {
      const res = await fetch('/api/notes/create-note', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      })
      const data = await res.json();
      onNoteSaved(data.newNote);
      
    } catch (error) {
      console.error(error);
      alert("Error creating note");
    }

  }

  return (
    <Modal show onHide={onDismiss} onSubmit={handleSubmit(onSubmit)}>
      <Modal.Header closeButton>
          <Modal.Title>
            Add Note
          </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form id="addNoteForm">
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
        form="addNoteForm"
        disabled={isSubmitting}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddNoteDialog