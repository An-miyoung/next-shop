"use client";

import React, { useTransition } from "react";
import AuthFormContainer from "@components/AuthFormContainer";
import { Button, Input } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as yup from "yup";
import ErrorsRender from "@components/ErrorsRender";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("이메일형식에 맞지않습니다.")
    .required("이메일은 필수입력항목입니다."),
  password: yup.string().required("비밀번호는 필수입력항목입니다."),
});

export default function SignIn() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, action) => {
      action.setSubmitting(true);
      // fetch('api/auth/signin) 을 하지 않고,
      // next-auth/react 가 미리 만든 함수인 signIn 을 불러온다.
      const res = await signIn("credentials", {
        ...values,
        // signin 실패시 error 화면으로 가지 못하게 한다.
        redirect: false,
      });

      if (res?.error === "CredentialsSignin") {
        const toastMsg = () => (
          <div>
            가입하지 않은 이메일이거나
            <br />
            비밀번호가 다릅니다.
          </div>
        );
        toast.warning(toastMsg);
      }

      if (!res?.error) {
        router.refresh();
      }
      action.setSubmitting(false);
    },
  });

  const { email, password } = values;
  type valueKeys = keyof typeof values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  const naverSignin = async () => {
    const result = await signIn("naver", { redirect: false });
    if (result?.error) {
      const toastMsg = () => (
        <div>
          네이버로그인에 실패했습니다.
          <br />
          다시 시도해 주세요.
        </div>
      );
      toast.warning(toastMsg);
    }
  };

  return (
    <div className="flex-col">
      <AuthFormContainer title="로그인 합니다." onSubmit={handleSubmit}>
        <Input
          name="email"
          label="이메일"
          crossOrigin={undefined}
          onChange={handleChange}
          onBlur={handleBlur}
          value={email}
          autoComplete="email"
          error={error("email")}
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
          onBlur={handleBlur}
          value={password}
          autoComplete="off"
          error={error("password")}
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
          로그인
        </Button>
        <div className="flex items-center justify-between">
          <Link href="/auth/signup" className="text-sm text-blue-gray-800">
            회원가입
          </Link>
          <Link
            href="/auth/forget-password"
            className="text-sm text-blue-gray-800"
          >
            비밀번호 있으셨나요?
          </Link>
        </div>
      </AuthFormContainer>

      <div className="px-6 py-4 flex justify-between items-center space-x-4">
        <button
          onClick={() =>
            startTransition(async () => {
              naverSignin();
            })
          }
          disabled={isPending}
        >
          <Image
            src="/naver-login.png"
            alt="naver login btn"
            width={180}
            height={20}
          />
        </button>
        <div className="w-[150px] h-[50px] bg-yellow-600 ">
          <h1>카카오 로그인</h1>
        </div>
      </div>
    </div>
  );
}
