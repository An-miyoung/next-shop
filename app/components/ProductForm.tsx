"use client";

import {
  Button,
  Input,
  Option,
  Select,
  Textarea,
} from "@material-tailwind/react";
import React, {
  useEffect,
  useState,
  useTransition,
  ChangeEventHandler,
} from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import categories from "@/app/utils/categories";
import ImageSelector from "@components/ImageSelector";
import { NewProductInfo } from "@app/types";

interface Props {
  initialValue?: InitialValue;
  onSubmit(values: NewProductInfo): void;
}

export interface InitialValue {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images?: string[];
  bulletPoints: string[];
  mrp: number;
  salePrice: number;
  category: string;
  quantity: number;
}

const defaultValue = {
  title: "",
  description: "",
  bulletPoints: [""],
  mrp: 0,
  salePrice: 0,
  category: "",
  quantity: 0,
};

export default function ProductForm(props: Props) {
  const { onSubmit, initialValue } = props;
  const [isPending, startTransition] = useTransition();
  // 상태가 변함에 따라 다시 render 하게 만드는 trigger 들
  const [images, setImages] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File>();
  const [isForUpdate, setIsForUpdate] = useState(false);
  const [productInfo, setProductInfo] = useState({ ...defaultValue });
  const [thumbnailSource, setThumbnailSource] = useState<string[]>();
  const [productImagesSource, setProductImagesSource] = useState<string[]>();

  const fields = productInfo.bulletPoints;

  const addMoreBulletPoints = () => {
    setProductInfo({
      ...productInfo,
      bulletPoints: [...productInfo.bulletPoints, ""],
    });
  };

  const removeBulletPoint = (indexToRemove: number) => {
    const points = [...productInfo.bulletPoints];
    const filteredPoints = points.filter((_, index) => index !== indexToRemove);
    setProductInfo({
      ...productInfo,
      bulletPoints: [...filteredPoints],
    });
  };

  const updateBulletPointValue = (value: string, index: number) => {
    const oldValues = [...fields];
    oldValues[index] = value;

    setProductInfo({ ...productInfo, bulletPoints: [...oldValues] });
  };

  const removeImage = async (index: number) => {
    const newImages = images.filter((_, idx) => idx !== index);
    setImages([...newImages]);
  };

  const getBtnTitle = () => {
    if (isForUpdate) return isPending ? "수정하는중.." : "수정하기";
    return isPending ? "새상품 등록중..." : "새상품 등록하기";
  };

  // 이미지들을 바꿀때 onChange 를 그대로 이어서 써야만 target 을 바로 손댈수 있다.
  const onImagesChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const files = target.files;
    if (files) {
      const newImages = Array.from(files).map((item) => item);
      const oldImages = productImagesSource || [];
      setImages([...images, ...newImages]);
      setProductImagesSource([
        ...oldImages,
        ...newImages.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  // 대표이미지를 바꿀때
  const onThumbnailChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const files = target.files;
    if (files) {
      const file = files[0];
      setThumbnail(file);
      setThumbnailSource([URL.createObjectURL(file)]);
    }
  };

  useEffect(() => {
    if (initialValue) {
      setProductInfo({ ...initialValue });
      setThumbnailSource([initialValue.thumbnail]);
      setProductImagesSource(initialValue.images);
      setIsForUpdate(true);
    }
  }, [initialValue]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="mb-2 text-xl">Add new product</h1>

      <form
        action={() =>
          startTransition(async () => {
            await onSubmit({ ...productInfo, images, thumbnail });
          })
        }
        className="space-y-6"
      >
        <div className="space-y-4">
          <h3>대표이미지</h3>
          <ImageSelector
            id="thumb"
            images={thumbnailSource}
            onChange={onThumbnailChange}
          />

          <h3>이미지들</h3>
          <ImageSelector
            multiple
            id="images"
            images={productImagesSource}
            onRemove={removeImage}
            onChange={onImagesChange}
          />
        </div>

        <Input
          label="상품명"
          value={productInfo.title}
          onChange={({ target }) =>
            setProductInfo({ ...productInfo, title: target.value })
          }
          crossOrigin={undefined}
        />

        <Textarea
          className="h-52"
          label="상품설명"
          name="description"
          value={productInfo.description}
          onChange={({ target }) =>
            setProductInfo({ ...productInfo, description: target.value })
          }
        />

        <Select
          onChange={(category) => {
            if (category) setProductInfo({ ...productInfo, category });
          }}
          value={productInfo.category}
          label="카테고리선택"
        >
          {categories.map((c) => (
            <Option value={c} key={c}>
              {c}
            </Option>
          ))}
        </Select>

        <div className="flex space-x-4">
          <div className="space-y-4 flex-1">
            <h3>상품가격</h3>

            <Input
              value={productInfo.mrp}
              label="MRP"
              onChange={({ target }) => {
                const mrp = +target.value;
                setProductInfo({ ...productInfo, mrp });
              }}
              className="mb-4"
              crossOrigin={undefined}
            />
            <Input
              value={productInfo.salePrice}
              label="할인된 가격"
              onChange={({ target }) => {
                const salePrice = +target.value;
                setProductInfo({ ...productInfo, salePrice });
              }}
              className="mb-4"
              crossOrigin={undefined}
            />
          </div>

          <div className="space-y-4 flex-1">
            <h3>재고수량</h3>

            <Input
              value={productInfo.quantity}
              label="개"
              onChange={({ target }) => {
                const quantity = +target.value;
                if (!isNaN(quantity))
                  setProductInfo({ ...productInfo, quantity });
              }}
              className="mb-4"
              crossOrigin={undefined}
            />
          </div>
        </div>
        {/* 한줄 홍보 추가하기를 누르면 productInfo.bulletPoints 에 빈 string" " 을 추가한다. */}
        {/* 그러면, productInfo.bulletPoints의 수가 늘어서 render 가 다시 되면서 입력창이 생긴다. */}
        {/* 입력창에 입력하면 onChange 에 의해 값이 productInfo.bulletPoints 에 일단 추가시킨후 */}
        {/* oldValues 라는 이름으로 내용을 다 덮어쓴다. 상태가 변하면 다시 render 된다. */}
        <div className="space-y-4">
          <h3>한줄 상품홍보</h3>
          {fields.map((field, index) => (
            <div key={index} className="flex items-center">
              <Input
                type="text"
                value={field}
                label={`한줄홍보 ${index + 1}`}
                onChange={({ target }) =>
                  updateBulletPointValue(target.value, index)
                }
                className="mb-4"
                crossOrigin={undefined}
              />
              {fields.length > 1 ? (
                <button
                  onClick={() => removeBulletPoint(index)}
                  type="button"
                  className="ml-2"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              ) : null}
            </div>
          ))}

          <button
            disabled={isPending}
            type="button"
            onClick={addMoreBulletPoints}
            className="flex items-center space-x-1 text-gray-800 ml-auto"
          >
            <PlusIcon className="w-4 h-4" />
            <span>한줄홍보 추가하기</span>
          </button>
        </div>

        <Button disabled={isPending} type="submit" color="blue">
          {getBtnTitle()}
        </Button>
      </form>
    </div>
  );
}
