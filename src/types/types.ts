import React from "react";


export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
export type UseStateResult<T> = [T, SetState<T>];

export type UseStateProps<Type extends Record<string, any>> = Type & {
  [Property in keyof Type as `set${Capitalize<string & Property>}`]: SetState<Type[Property]>
};
