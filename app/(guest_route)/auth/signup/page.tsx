"use client";

import React from "react";
import AuthFormContainer from "@components/AuthFormContainer";
import { Button, Input } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as yup from "yup";
import ErrorsRender from "@utils/ErrorsRender";
import Link from "next/link";
import { toast } from "react-toastify";

const validationSchema = yup.object().shape({
  name: yup.string().required("이름은 필수입력항목입니다."),
  email: yup
    .string()
    .email("이메일형식에 맞지않습니다.")
    .required("이메일은 필수입력항목입니다."),
  password: yup
    .string()
    .min(7, "7글자이상 입력해주세요.")
    .required("비밀번호는 필수입력항목입니다."),
});

export default function SignUp() {
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, action) => {
      action.setSubmitting(true);
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.ok) {
        const { message } = (await res.json()) as { message: string };
        toast.success(message);
      }
      action.setSubmitting(false);
    },
  });

  const { name, email, password } = values;

  return (
    <AuthFormContainer title="회원가입을 합니다." onSubmit={handleSubmit}>
      <Input
        name="name"
        label="이름"
        crossOrigin={undefined}
        onChange={handleChange}
        onBlur={handleBlur}
        value={name}
        autoComplete="username"
      />
      {errors.name !== undefined && touched.name && (
        <ErrorsRender errorMessage={errors.name} />
      )}
      <Input
        name="email"
        label="이메일"
        crossOrigin={undefined}
        onChange={handleChange}
        value={email}
        autoComplete="email"
      />
      {errors.email !== undefined && touched.email && (
        <ErrorsRender errorMessage={errors.email} />
      )}
      <Input
        name="password"
        label="비밀번호"
        type="password"
        crossOrigin={undefined}
        onChange={handleChange}
        value={password}
        autoComplete="off"
      />
      {errors.password !== undefined && touched.password && (
        <ErrorsRender errorMessage={errors.password} />
      )}
      <Button
        type="submit"
        className="w-full"
        color="blue"
        disabled={isSubmitting}
      >
        가입하기
      </Button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signin" className="text-sm text-blue-gray-800">
          로그인
        </Link>
        <Link
          href="/auth/forget-password"
          className="text-sm text-blue-gray-800"
        >
          비밀번호 찾기
        </Link>
      </div>
    </AuthFormContainer>
  );
}
