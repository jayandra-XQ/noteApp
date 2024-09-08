import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import styleUtils from "../styles/utils.module.css"

interface LoginModalProps {
  onDismiss: () => void;
  onLoginSuccessful: (user: User) => void
}

interface UserInput {
  username: string,
  email: string
  password: string
}

const LoginModal = ({ onDismiss, onLoginSuccessful }: LoginModalProps) => {

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserInput>();

  const onSubmit = async (input: UserInput) => {
    try {
      const res = await fetch('/api/user/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      const user = data.user;

      onLoginSuccessful(user);
      onDismiss(); // Close the modal after successful login

    } catch (error) {
      console.error(error);
      alert("Error signing in");
    }
  }
  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
                <Modal.Title>
                    Log In
                </Modal.Title>
            </Modal.Header>

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
          name="password"
          label="Password"
          type="password"
          placeholder="Password"
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.password}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className={styleUtils.width100}>
          Log In
        </Button>
        </Form>

    </Modal>
  )
}

export default LoginModal