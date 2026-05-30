"use client";

import styles from "./deleteprofilemodal.module.scss";
import Button from "../UI/Button/Button";
import Form from "../UI/Form/Form";
import Modal from "../UI/Portal/Modal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteUser } from "@/_utils/server/authApi";

interface IDeleteProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteProfileModule({
  isOpen,
  onClose,
}: IDeleteProfileProps) {
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    deleteUser()
      .then(() => router.push("/"))
      .catch((err) => setServerErrorMessage(err.message));
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Вы уверены?">
      <Form handleSubmit={handleSubmit}>
        <div className={styles.deleteprofile}>
          <div className={styles.deleteprofile__buttons}>
            <Button type="submit">Да</Button>
            <Button type="button" onClick={onClose}>
              Нет
            </Button>
          </div>
          <p className={styles.deleteprofile__errors}>{serverErrorMessage}</p>
        </div>
      </Form>
    </Modal>
  );
}
