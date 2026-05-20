/* eslint-disable import/order */
/* eslint-disable no-param-reassign */
"use client"

import type React from "react"

import { useRef, useState } from "react"
export interface Props {
  setCode: any;
  code: string[];
  postVerify?: any;
  setIsLoading?: any;
  isLoading?: boolean;
}
export default function OTPForm({ setCode,code,postVerify,setIsLoading,isLoading }: Props) {

  const [error, setError] = useState("") // Thêm state để lưu trữ thông báo lỗi
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const lastChar = value.slice(-1)
    const newCode = [...code]
    newCode[index] = lastChar
    setCode(newCode)
    if (error) setError("")

    if (lastChar !== "" && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      const newCode = [...code]

      if (code[index] === "") {
        if (index > 0) {
          newCode[index - 1] = ""
          setCode(newCode)
          inputRefs.current[index - 1]?.focus()
        }
      } else {
        newCode[index] = ""
        setCode(newCode)
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = code.join("")

    if (fullCode.length !== 4) {
      setError("Vui lòng điền đầy đủ 4 số")
      return
    }

    setIsLoading(true)
    setError("")
    console.log("Mã xác thực:", fullCode)

   postVerify({ pin: fullCode })
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
       
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px 30px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "10px",
            textAlign: "center",
            color: "#333",
            paddingBottom: "10px",
          }}
        >
          Xác thực mã PIN
        </h1>

        {/* <p
          style={{
            fontSize: "14px",
            color: "#666",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Vui lòng nhập mã 4 số được gửi đến email củ
        </p> */}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginBottom: "30px",
            }}
          >
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                style={{
                  width: "50px",
                  height: "50px",
                  fontSize: "24px",
                  fontWeight: "bold",
                  textAlign: "center",
                  border: `2px solid ${digit === "" ? "#ddd" : "#007bff"}`,
                  borderRadius: "8px",
                  outline: "none",
                  transition: "all 0.2s ease",
                  backgroundColor: isLoading ? "#e9ecef" : "#f9f9f9",
                  color: "#333",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                }}
                onFocus={(e) => {
                  if (!isLoading) {
                    e.target.style.borderColor = "#007bff"
                    e.target.style.backgroundColor = "#f0f8ff"
                  }
                }}
                onBlur={(e) => {
                  if (!isLoading) {
                    e.target.style.borderColor = digit === "" ? "#ddd" : "#007bff"
                    e.target.style.backgroundColor = "#f9f9f9"
                  }
                }}
              />
            ))}
          </div>

          {error && (
            <div
              style={{
                color: "#dc3545",
                fontSize: "14px",
                marginBottom: "20px",
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: isLoading ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s ease",
              opacity: isLoading ? 0.8 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                (e.target as HTMLButtonElement).style.backgroundColor = "#0056b3"
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                (e.target as HTMLButtonElement).style.backgroundColor = "#007bff"
              }
            }}
          >
            {isLoading ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: "16px",
                    height: "16px",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Đang gửi...
              </>
            ) : (
              "Xác thực"
            )}
          </button>

          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </form>

        {/* <p
          style={{
            fontSize: "12px",
            color: "#999",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          Không nhận được mã?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              console.log("Gửi lại mã")
              alert("Mã xác thực sẽ được gửi lại")
            }}
            style={{
              color: "#007bff",
              textDecoration: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Gửi lại
          </a>
        </p> */}
      </div>
    </div>
  )
}
