"use client";

import { useState } from "react";

export type ObjectState<T extends object> = T & { set: { [key in keyof T]: (value: T[key]) => void } }

export function useDefaultObjectState<T extends object>(obj: T) : ObjectState<T> {
  const newObj: any = {};
  const setObj: any = {};
  for (let key in obj) {
    newObj[key] = val;
    setObj[key] = () => {};
  }
  newObj.set = setObj;
  return newObj as ObjectState<T>;
}

export function useObjectState<T extends object>(obj: T) : ObjectState<T> {
  const newObj: any = {};
  const setObj: any = {};
  for (let key in obj) {
    const [ val, setVal ] = useState(obj[key]);
    newObj[key] = val;
    setObj[key] = setVal;
  }
  newObj.set = setObj;
  return newObj as ObjectState<T>;
}