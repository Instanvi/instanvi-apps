import React from 'react';
import TextArea from '@potta/components/textArea';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface NotesProps {
  register: UseFormRegister<any>;
  errors: FieldError | undefined;
}

const Notes: React.FC<NotesProps> = ({ register, errors }) => {
  return (
    <div className="mt-4 w-full">
      <TextArea
        name="notes"
        label="Notes"
        height={true}
        errors={errors}
        register={register}
        placeholder="Type your message here"
      />
    </div>
  );
};

export default Notes;
