import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useSignUpState } from './useSignUpState';
import { formVariants, itemVariants } from './animations';

export const SignUpForm: React.FC = () => {
  const { formData, setFormData, setIsSubmitted } = useSignUpState();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="w-full"
    >
      <motion.div variants={itemVariants}>
        <Input
          type="text"
          name="name"
          placeholder="Your Name"
          className="mb-4"
          value={formData.name}
          onChange={handleInputChange}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Input
          type="email"
          name="email"
          placeholder="Your Email"
          className="mb-4"
          value={formData.email}
          onChange={handleInputChange}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Button type="submit" className="w-full">Submit</Button>
      </motion.div>
    </motion.form>
  );
};