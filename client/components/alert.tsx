import { useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { removeAlert } from "../redux/reducers/AlertsSlice";

export default function Alert(props: any) {
  const dispatch = useAppDispatch();
  const alert = props.alert;

  return (
    <span className="absolute m-auto text-center content-center right-6 self-center">
      <div className="text-center py-4 lg:px-4">
        <div
          className={
            "p-2 bg-opacity-40 hover:bg-opacity-70 items-center text-gray-100 leading-none lg:rounded-full flex lg:inline-flex bg-" +
            alert.color +
            "-800"
          }
          role="alert"
        >
          <span
            className={
              "flex rounded-full bg-opacity-60 text-white uppercase px-2 py-1 text-xs font-bold mr-3 bg-" +
              alert.color +
              "-500"
            }
          >
            {alert.type}
          </span>
          <span className="font-semibold mr-2 text-left capitalize flex-auto">
            {alert.content}
          </span>
          <svg
            className="fill-current h-6 w-6 text-gray-100"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            onClick={() => dispatch(removeAlert(alert.content))}
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </div>
      </div>
    </span>
  );
}
