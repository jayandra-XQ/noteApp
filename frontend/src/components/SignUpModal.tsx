import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import styleUtils from "../styles/utils.module.css"

interface SignUpModalProps {
  onDismiss: () => void;
  onsignUpSuccessful: (user: User) => void;

}

interface UserInput {
  username: string,
  email: string
  password: string
}


const SignUpModal = ({ onDismiss, onsignUpSuccessful }: SignUpModalProps) => {

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserInput>();

  const onSubmit = async (input: UserInput) => {
    try {
      const res = await fetch('/api/user/signup', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      const user = data.user;

      onsignUpSuccessful(user);
      onDismiss(); // Close the modal after successful signup

    } catch (error) {
      console.error(error);
      alert("Error signing up");
    }
  }
  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>
          Sign Up
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="username"
            label="Username"
            type="text"
            placeholder="Username"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.username}
          />

          <TextInputField
            name="email"
            label="Email"
            type="email"
            placeholder="Email"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.email}
          />

          <TextInputField
            name="password"
            label="Password"
            type="password"
            placeholder="Password"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.password}
          />

          <Button
          className={styleUtils.width100}
          type="submit"
          disabled={isSubmitting}
          >
            Sign Up
          </Button>

        </Form>
      </Modal.Body>

    </Modal>
  )
}

export default SignUpModal