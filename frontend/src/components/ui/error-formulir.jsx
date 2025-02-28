import React from "react";

const ErrorFormulir = ({ error }) => {
    return (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-4 shadow-sm">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                         fill="currentColor">
                        <path fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                              clipRule="evenodd"/>
                    </svg>
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800 mb-2">Terdapat kesalahan</h3>
                    {Array.isArray(error) ? (
                        <ul className="list-disc space-y-1 pl-5">
                            {error.map((err, index) => (
                                <li key={index} className="text-sm text-red-700">{err}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-red-700">{error}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ErrorFormulir;