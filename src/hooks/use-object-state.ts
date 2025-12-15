"use client";

import { useState } from "react";

export type ObjectState<T extends object> = T & { set: { [key in keyof T]: (value: T[key]) => void } }

export function defaultObjectState<T extends object>(obj: T) : ObjectState<T> {
  const newObj: Record<string, unknown> = {};
  const setObj: Record<string, unknown> = {};
  for (const key in obj) {
    newObj[key] = obj[key];
    setObj[key] = () => {};
  }
  newObj.set = setObj;
  return newObj as ObjectState<T>;
}

export function useObjectState<T extends object>(obj: T) : ObjectState<T> {
  const newObj: Record<string, unknown> = {};
  const setObj: Record<string, unknown> = {};
  for (const key in obj) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [ val, setVal ] = useState(obj[key]);
    newObj[key] = val;
    setObj[key] = setVal;
  }
  newObj.set = setObj;
  return newObj as ObjectState<T>;
}