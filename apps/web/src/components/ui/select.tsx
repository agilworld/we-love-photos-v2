import { ComponentPropsWithRef } from "react";

export type SelectProps = {
  id: string;
  labelText: string;
  defaultText: string;
  data: [string, string][];
} & ComponentPropsWithRef<"select">;

export default function Select({
  id,
  labelText,
  defaultText,
  data,
  ...rest
}: SelectProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {labelText}
      </label>
      <select
        id={id}
        className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        {...rest}
      >
        {defaultText ? <option>{defaultText}</option> : null}
        {data.map((item) => (
          <option key={item[0]} value={item[0]}>
            {item[1]}
          </option>
        ))}
      </select>
    </div>
  );
}
