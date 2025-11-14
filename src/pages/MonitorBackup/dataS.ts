export  const months = [
  { value: 1, label: 'Tháng 1' },
  { value: 2, label: 'Tháng 2' },
  { value: 3, label: 'Tháng 3' },
  { value: 4, label: 'Tháng 4' },
  { value: 5, label: 'Tháng 5' },
  { value: 6, label: 'Tháng 6' },
  { value: 7, label: 'Tháng 7' },
  { value: 8, label: 'Tháng 8' },
  { value: 9, label: 'Tháng 9' },
  { value: 10, label: 'Tháng 10' },
  { value: 11, label: 'Tháng 11' },
  { value: 12, label: 'Tháng 12' },
];
export const growthPercent = Array.from({ length: 20 }, (_, index) => {
  const value = (index + 1) * 5;
  return {
    value: value / 100,
    label: `${value}%`,
  };
});

export const dataS = [
           {
                key: "DTDK",
                name: "Doanh Thu Dự Kiến",
                item_value: null,
                sequence: 1,
                children: [
                    {
                        key: "C11",
                        name: "Doctor Check Cá Nhân",
                        item_value: null,
                        sequence: 3,
                        children: [
                            {
                                key: "C111",
                                name: "Gói Nam",
                                item_value: null,
                                sequence: 4,
                                children: [
                                    {
                                        key: "C1111",
                                        name: "Gói Tiêu Chuẩn (Nam)",
                                        item_value: 0.0000,
                                        sequence: 5,
                                        children: []
                                    },
                                    {
                                        key: "C1112",
                                        name: "Gói Chuyên Sâu (Nam)",
                                        item_value: 2950000.0000,
                                        sequence: 6,
                                        children: []
                                    },
                                    {
                                        key: "C1113",
                                        name: "Gói VIP (Nam)",
                                        item_value: 5210000.0000,
                                        sequence: 7,
                                        children: []
                                    },
                                    {
                                        key: "C1114",
                                        name: "Gói Premium (Nam)",
                                        item_value: 0.0000,
                                        sequence: 8,
                                        children: []
                                    },
                                    {
                                        key: "C1115",
                                        name: "Gói Trường Thọ (Nam)",
                                        item_value: 0.0000,
                                        sequence: 9,
                                        children: []
                                    }
                                ]
                            },
                            {
                                key: "C112",
                                name: "Gói Nữ",
                                item_value: null,
                                sequence: 10,
                                children: [
                                    {
                                        key: "C1121",
                                        name: "Gói Tiêu Chuẩn (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 11,
                                        children: []
                                    },
                                    {
                                        key: "C1122",
                                        name: "Gói Chuyên Sâu (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 12,
                                        children: []
                                    },
                                    {
                                        key: "C1123",
                                        name: "Gói VIP (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 13,
                                        children: []
                                    },
                                    {
                                        key: "C1124",
                                        name: "Gói Premium (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 14,
                                        children: []
                                    },
                                    {
                                        key: "C1125",
                                        name: "Gói Trường Thọ (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 15,
                                        children: []
                                    }
                                ]
                            },
                            {
                                key: "C113",
                                name: "Gói Lẻ",
                                item_value: null,
                                sequence: 16,
                                children: [
                                    {
                                        key: "C1131",
                                        name: "Tầm soát ung thư dạ dày",
                                        item_value: 0.0000,
                                        sequence: 17,
                                        children: []
                                    },
                                    {
                                        key: "C1132",
                                        name: "Tầm soát ung thư đại tràng",
                                        item_value: 0.0000,
                                        sequence: 18,
                                        children: []
                                    },
                                    {
                                        key: "C1133",
                                        name: "Tầm soát ung thư ống tiêu hoá",
                                        item_value: 0.0000,
                                        sequence: 19,
                                        children: []
                                    },
                                    {
                                        key: "C1134",
                                        name: "Tầm soát ung thư gan",
                                        item_value: 0.0000,
                                        sequence: 20,
                                        children: []
                                    },
                                    {
                                        key: "C1135",
                                        name: "Tầm soát yếu tố nguy cơ đột quỵ",
                                        item_value: 0.0000,
                                        sequence: 21,
                                        children: []
                                    },
                                    {
                                        key: "C1136",
                                        name: "Tầm soát ung thư phổi",
                                        item_value: 0.0000,
                                        sequence: 22,
                                        children: []
                                    },
                                    {
                                        key: "C1137",
                                        name: "Tầm soát ung thư vú",
                                        item_value: 0.0000,
                                        sequence: 23,
                                        children: []
                                    },
                                    {
                                        key: "C1138",
                                        name: "Tầm soát ung thư cổ tử cung",
                                        item_value: 0.0000,
                                        sequence: 24,
                                        children: []
                                    },
                                    {
                                        key: "C1139",
                                        name: "Chích ngừa cúm",
                                        item_value: 0.0000,
                                        sequence: 25,
                                        children: []
                                    }
                                ]
                            },
                            {
                                key: "C114",
                                name: "Dịch Vụ Lẻ",
                                item_value: null,
                                sequence: 26,
                                children: [
                                    {
                                        key: "C1141",
                                        name: "Xét Nghiệm",
                                        item_value: null,
                                        sequence: 27,
                                        children: [
                                            {
                                                key: "C11411",
                                                name: "Xét Nghiệm Huyết Học",
                                                item_value: null,
                                                sequence: 28,
                                                children: [
                                                    {
                                                        key: "C114111",
                                                        name: "Đông Máu",
                                                        item_value: 405000.0000,
                                                        sequence: 29,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114112",
                                                        name: "Công Thức Máu",
                                                        item_value: 1000000.0000,
                                                        sequence: 30,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11412",
                                                name: "Xét Nghiệm Miễn Dịch",
                                                item_value: 6490000.0000,
                                                sequence: 31,
                                                children: []
                                            },
                                            {
                                                key: "C11413",
                                                name: "Xét Nghiệm Nước Tiểu",
                                                item_value: 800000.0000,
                                                sequence: 32,
                                                children: []
                                            },
                                            {
                                                key: "C11414",
                                                name: "Xét Nghiệm Soi Phân",
                                                item_value: 0.0000,
                                                sequence: 33,
                                                children: []
                                            },
                                            {
                                                key: "C11415",
                                                name: "Xét Nghiệm Vi Sinh",
                                                item_value: 0.0000,
                                                sequence: 34,
                                                children: []
                                            },
                                            {
                                                key: "C11416",
                                                name: "Xét Nghiệm Sinh Học Phân Tử",
                                                item_value: 0.0000,
                                                sequence: 35,
                                                children: []
                                            },
                                            {
                                                key: "C11417",
                                                name: "Xét Nghiệm Sinh Hoá",
                                                item_value: 10070000.0000,
                                                sequence: 36,
                                                children: []
                                            },
                                            {
                                                key: "C11418",
                                                name: "Xét Nghiệm Hơi Thở",
                                                item_value: 0.0000,
                                                sequence: 37,
                                                children: []
                                            },
                                            {
                                                key: "C114190",
                                                name: "Xét Nghiệm Giải Phẫu Bệnh",
                                                item_value: 395000.0000,
                                                sequence: 38,
                                                children: []
                                            },
                                            {
                                                key: "C114191",
                                                name: "Xét Nghiệm Ký Sinh Trùng",
                                                item_value: 0.0000,
                                                sequence: 39,
                                                children: []
                                            },
                                            {
                                                key: "C114192",
                                                name: "Cấy Vi Trùng & Kháng Sinh Đồ",
                                                item_value: 0.0000,
                                                sequence: 40,
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1142",
                                        name: "Chẩn Đoán Hình Ảnh",
                                        item_value: null,
                                        sequence: 41,
                                        children: [
                                            {
                                                key: "C11421",
                                                name: "X Quang",
                                                item_value: 1440000.0000,
                                                sequence: 42,
                                                children: []
                                            },
                                            {
                                                key: "C11422",
                                                name: "Siêu Âm",
                                                item_value: 9920000.0000,
                                                sequence: 43,
                                                children: []
                                            },
                                            {
                                                key: "C11423",
                                                name: "CT",
                                                item_value: 0.0000,
                                                sequence: 44,
                                                children: []
                                            },
                                            {
                                                key: "C11424",
                                                name: "Đo Loãng Xương",
                                                item_value: 0.0000,
                                                sequence: 45,
                                                children: []
                                            },
                                            {
                                                key: "C11425",
                                                name: "Nhũ Ảnh",
                                                item_value: 0.0000,
                                                sequence: 46,
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1143",
                                        name: "Thăm Dò Chức Năng",
                                        item_value: null,
                                        sequence: 47,
                                        children: [
                                            {
                                                key: "C11431",
                                                name: "Điện Tim",
                                                item_value: 420000.0000,
                                                sequence: 48,
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1144",
                                        name: "Nội Soi",
                                        item_value: null,
                                        sequence: 49,
                                        children: [
                                            {
                                                key: "C11441",
                                                name: "Dạ Dày",
                                                item_value: null,
                                                sequence: 50,
                                                children: [
                                                    {
                                                        key: "C114411",
                                                        name: "Thường",
                                                        item_value: 0.0000,
                                                        sequence: 51,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114412",
                                                        name: "Mê",
                                                        item_value: 0.0000,
                                                        sequence: 52,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11442",
                                                name: "Đại Tràng",
                                                item_value: null,
                                                sequence: 53,
                                                children: [
                                                    {
                                                        key: "C114421",
                                                        name: "Thường",
                                                        item_value: 0.0000,
                                                        sequence: 54,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114422",
                                                        name: "Mê",
                                                        item_value: 0.0000,
                                                        sequence: 55,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11443",
                                                name: "Trực Tràng",
                                                item_value: 0.0000,
                                                sequence: 56,
                                                children: []
                                            },
                                            {
                                                key: "C11446",
                                                name: "Cặp",
                                                item_value: null,
                                                sequence: 57,
                                                children: [
                                                    {
                                                        key: "C114461",
                                                        name: "Thường",
                                                        item_value: 0.0000,
                                                        sequence: 58,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114462",
                                                        name: "Mê",
                                                        item_value: 4795000.0000,
                                                        sequence: 59,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11444",
                                                name: "Thủ Thuật Nội Soi",
                                                item_value: null,
                                                sequence: 60,
                                                children: [
                                                    {
                                                        key: "C114441",
                                                        name: "Công Cắt Polyp",
                                                        item_value: 0.0000,
                                                        sequence: 61,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114442",
                                                        name: "Sinh Thiết Trọn",
                                                        item_value: 0.0000,
                                                        sequence: 62,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11445",
                                                name: "Vật Tư Y Tế",
                                                item_value: null,
                                                sequence: 64,
                                                children: [
                                                    {
                                                        key: "C114451",
                                                        name: "Thòng Lọng Lạnh",
                                                        item_value: 0.0000,
                                                        sequence: 65,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114452",
                                                        name: "Thòng Lọng Nóng",
                                                        item_value: 0.0000,
                                                        sequence: 66,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114453",
                                                        name: "Kiềm Sinh Thiết",
                                                        item_value: 0.0000,
                                                        sequence: 67,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114454",
                                                        name: "Clip Cầm Máu",
                                                        item_value: 0.0000,
                                                        sequence: 68,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114455",
                                                        name: "Kim Chích Nâng",
                                                        item_value: 0.0000,
                                                        sequence: 69,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114456",
                                                        name: "Clo-test",
                                                        item_value: 0.0000,
                                                        sequence: 70,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114457",
                                                        name: "Thuốc An Thần (Propofol)",
                                                        item_value: 0.0000,
                                                        sequence: 71,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114458",
                                                        name: "Thuốc An Thần (Fentanyl)",
                                                        item_value: 0.0000,
                                                        sequence: 72,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114459",
                                                        name: "Thuốc Xổ",
                                                        item_value: 0.0000,
                                                        sequence: 73,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C1144510",
                                                        name: "Găng Tay Y Tế",
                                                        item_value: 0.0000,
                                                        sequence: 74,
                                                        children: []
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1145",
                                        name: "Khám Lâm Sàng",
                                        item_value: null,
                                        sequence: 75,
                                        children: [
                                            {
                                                key: "C11451",
                                                name: "Nội Tổng Quát",
                                                item_value: 1900000.0000,
                                                sequence: 76,
                                                children: []
                                            },
                                            {
                                                key: "C11452",
                                                name: "Nội Tiêu Hoá",
                                                item_value: 0.0000,
                                                sequence: 77,
                                                children: []
                                            },
                                            {
                                                key: "C11453",
                                                name: "Tiền Mê",
                                                item_value: 0.0000,
                                                sequence: 78,
                                                children: []
                                            },
                                            {
                                                key: "C11454",
                                                name: "Khám Mắt",
                                                item_value: 0.0000,
                                                sequence: 79,
                                                children: []
                                            },
                                            {
                                                key: "C11455",
                                                name: "Tai Mũi Họng",
                                                item_value: 0.0000,
                                                sequence: 80,
                                                children: []
                                            },
                                            {
                                                key: "C11456",
                                                name: "Phụ Khoa",
                                                item_value: 0.0000,
                                                sequence: 81,
                                                children: []
                                            },
                                            {
                                                key: "C11457",
                                                name: "Răng Hàm Mặt",
                                                item_value: 0.0000,
                                                sequence: 82,
                                                children: []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                key: "C115",
                                name: "Thuốc",
                                item_value: null,
                                sequence: 83,
                                children: [
                                    {
                                        key: "C1151",
                                        name: "Thuốc Bảo Hiểm",
                                        item_value: 0.0000,
                                        sequence: 84,
                                        children: []
                                    },
                                    {
                                        key: "C1152",
                                        name: "Thuốc Dịch Vụ",
                                        item_value: 2972800.0000,
                                        sequence: 85,
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                key: "DTDT",
                name: "Giảm Trừ Doanh Thu",
                item_value: null,
                sequence: 2,
                children: [
                    {
                        key: "C11",
                        name: "Doctor Check Cá Nhân",
                        item_value: null,
                        sequence: 3,
                        children: [
                            {
                                key: "C111",
                                name: "Gói Nam",
                                item_value: null,
                                sequence: 4,
                                children: [
                                    {
                                        key: "C1111",
                                        name: "Gói Tiêu Chuẩn (Nam)",
                                        item_value: 0.0000,
                                        sequence: 5,
                                        children: []
                                    },
                                    {
                                        key: "C1112",
                                        name: "Gói Chuyên Sâu (Nam)",
                                        item_value: 629333.3333,
                                        sequence: 6,
                                        children: []
                                    },
                                    {
                                        key: "C1113",
                                        name: "Gói VIP (Nam)",
                                        item_value: 1019514.4678,
                                        sequence: 7,
                                        children: []
                                    },
                                    {
                                        key: "C1114",
                                        name: "Gói Premium (Nam)",
                                        item_value: 0.0000,
                                        sequence: 8,
                                        children: []
                                    },
                                    {
                                        key: "C1115",
                                        name: "Gói Trường Thọ (Nam)",
                                        item_value: 0.0000,
                                        sequence: 9,
                                        children: []
                                    }
                                ]
                            },
                            {
                                key: "C112",
                                name: "Gói Nữ",
                                item_value: null,
                                sequence: 10,
                                children: [
                                    {
                                        key: "C1121",
                                        name: "Gói Tiêu Chuẩn (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 11,
                                        children: []
                                    },
                                    {
                                        key: "C1122",
                                        name: "Gói Chuyên Sâu (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 12,
                                        children: []
                                    },
                                    {
                                        key: "C1123",
                                        name: "Gói VIP (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 13,
                                        children: []
                                    },
                                    {
                                        key: "C1124",
                                        name: "Gói Premium (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 14,
                                        children: []
                                    },
                                    {
                                        key: "C1125",
                                        name: "Gói Trường Thọ (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 15,
                                        children: []
                                    }
                                ]
                            },
                            {
                                key: "C113",
                                name: "Gói Lẻ",
                                item_value: null,
                                sequence: 16,
                                children: [
                                    {
                                        key: "C1131",
                                        name: "Tầm soát ung thư dạ dày",
                                        item_value: 0.0000,
                                        sequence: 17,
                                        children: []
                                    },
                                    {
                                        key: "C1132",
                                        name: "Tầm soát ung thư đại tràng",
                                        item_value: 0.0000,
                                        sequence: 18,
                                        children: []
                                    },
                                    {
                                        key: "C1133",
                                        name: "Tầm soát ung thư ống tiêu hoá",
                                        item_value: 0.0000,
                                        sequence: 19,
                                        children: []
                                    },
                                    {
                                        key: "C1134",
                                        name: "Tầm soát ung thư gan",
                                        item_value: 0.0000,
                                        sequence: 20,
                                        children: []
                                    },
                                    {
                                        key: "C1135",
                                        name: "Tầm soát yếu tố nguy cơ đột quỵ",
                                        item_value: 0.0000,
                                        sequence: 21,
                                        children: []
                                    },
                                    {
                                        key: "C1136",
                                        name: "Tầm soát ung thư phổi",
                                        item_value: 0.0000,
                                        sequence: 22,
                                        children: []
                                    },
                                    {
                                        key: "C1137",
                                        name: "Tầm soát ung thư vú",
                                        item_value: 0.0000,
                                        sequence: 23,
                                        children: []
                                    },
                                    {
                                        key: "C1138",
                                        name: "Tầm soát ung thư cổ tử cung",
                                        item_value: 0.0000,
                                        sequence: 24,
                                        children: []
                                    },
                                    {
                                        key: "C1139",
                                        name: "Chích ngừa cúm",
                                        item_value: 0.0000,
                                        sequence: 25,
                                        children: []
                                    }
                                ]
                            },
                            {
                                key: "C114",
                                name: "Dịch Vụ Lẻ",
                                item_value: null,
                                sequence: 26,
                                children: [
                                    {
                                        key: "C1141",
                                        name: "Xét Nghiệm",
                                        item_value: null,
                                        sequence: 27,
                                        children: [
                                            {
                                                key: "C11411",
                                                name: "Xét Nghiệm Huyết Học",
                                                item_value: null,
                                                sequence: 28,
                                                children: [
                                                    {
                                                        key: "C114111",
                                                        name: "Đông Máu",
                                                        item_value: 6641.3662,
                                                        sequence: 29,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114112",
                                                        name: "Công Thức Máu",
                                                        item_value: 96407.0501,
                                                        sequence: 30,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11412",
                                                name: "Xét Nghiệm Miễn Dịch",
                                                item_value: 591413.6599,
                                                sequence: 31,
                                                children: []
                                            },
                                            {
                                                key: "C11413",
                                                name: "Xét Nghiệm Nước Tiểu",
                                                item_value: 96407.0501,
                                                sequence: 32,
                                                children: []
                                            },
                                            {
                                                key: "C11414",
                                                name: "Xét Nghiệm Soi Phân",
                                                item_value: 0.0000,
                                                sequence: 33,
                                                children: []
                                            },
                                            {
                                                key: "C11415",
                                                name: "Xét Nghiệm Vi Sinh",
                                                item_value: 0.0000,
                                                sequence: 34,
                                                children: []
                                            },
                                            {
                                                key: "C11416",
                                                name: "Xét Nghiệm Sinh Học Phân Tử",
                                                item_value: 0.0000,
                                                sequence: 35,
                                                children: []
                                            },
                                            {
                                                key: "C11417",
                                                name: "Xét Nghiệm Sinh Hoá",
                                                item_value: 1012274.0270,
                                                sequence: 36,
                                                children: []
                                            },
                                            {
                                                key: "C11418",
                                                name: "Xét Nghiệm Hơi Thở",
                                                item_value: 0.0000,
                                                sequence: 37,
                                                children: []
                                            },
                                            {
                                                key: "C114190",
                                                name: "Xét Nghiệm Giải Phẫu Bệnh",
                                                item_value: 0.0000,
                                                sequence: 38,
                                                children: []
                                            },
                                            {
                                                key: "C114191",
                                                name: "Xét Nghiệm Ký Sinh Trùng",
                                                item_value: 0.0000,
                                                sequence: 39,
                                                children: []
                                            },
                                            {
                                                key: "C114192",
                                                name: "Cấy Vi Trùng & Kháng Sinh Đồ",
                                                item_value: 0.0000,
                                                sequence: 40,
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1142",
                                        name: "Chẩn Đoán Hình Ảnh",
                                        item_value: null,
                                        sequence: 41,
                                        children: [
                                            {
                                                key: "C11421",
                                                name: "X Quang",
                                                item_value: 173532.6903,
                                                sequence: 42,
                                                children: []
                                            },
                                            {
                                                key: "C11422",
                                                name: "Siêu Âm",
                                                item_value: 1386797.2430,
                                                sequence: 43,
                                                children: []
                                            },
                                            {
                                                key: "C11423",
                                                name: "CT",
                                                item_value: 0.0000,
                                                sequence: 44,
                                                children: []
                                            },
                                            {
                                                key: "C11424",
                                                name: "Đo Loãng Xương",
                                                item_value: 0.0000,
                                                sequence: 45,
                                                children: []
                                            },
                                            {
                                                key: "C11425",
                                                name: "Nhũ Ảnh",
                                                item_value: 0.0000,
                                                sequence: 46,
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1143",
                                        name: "Thăm Dò Chức Năng",
                                        item_value: null,
                                        sequence: 47,
                                        children: [
                                            {
                                                key: "C11431",
                                                name: "Điện Tim",
                                                item_value: 55567.1902,
                                                sequence: 48,
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1144",
                                        name: "Nội Soi",
                                        item_value: null,
                                        sequence: 49,
                                        children: [
                                            {
                                                key: "C11441",
                                                name: "Dạ Dày",
                                                item_value: null,
                                                sequence: 50,
                                                children: [
                                                    {
                                                        key: "C114411",
                                                        name: "Thường",
                                                        item_value: 0.0000,
                                                        sequence: 51,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114412",
                                                        name: "Mê",
                                                        item_value: 0.0000,
                                                        sequence: 52,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11442",
                                                name: "Đại Tràng",
                                                item_value: null,
                                                sequence: 53,
                                                children: [
                                                    {
                                                        key: "C114421",
                                                        name: "Thường",
                                                        item_value: 0.0000,
                                                        sequence: 54,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114422",
                                                        name: "Mê",
                                                        item_value: 0.0000,
                                                        sequence: 55,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11443",
                                                name: "Trực Tràng",
                                                item_value: 0.0000,
                                                sequence: 56,
                                                children: []
                                            },
                                            {
                                                key: "C11446",
                                                name: "Cặp",
                                                item_value: null,
                                                sequence: 57,
                                                children: [
                                                    {
                                                        key: "C114461",
                                                        name: "Thường",
                                                        item_value: 0.0000,
                                                        sequence: 58,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114462",
                                                        name: "Mê",
                                                        item_value: 938305.5419,
                                                        sequence: 59,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11444",
                                                name: "Thủ Thuật Nội Soi",
                                                item_value: null,
                                                sequence: 60,
                                                children: [
                                                    {
                                                        key: "C114441",
                                                        name: "Công Cắt Polyp",
                                                        item_value: 0.0000,
                                                        sequence: 61,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114442",
                                                        name: "Sinh Thiết Trọn",
                                                        item_value: 0.0000,
                                                        sequence: 62,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11445",
                                                name: "Vật Tư Y Tế",
                                                item_value: null,
                                                sequence: 64,
                                                children: [
                                                    {
                                                        key: "C114451",
                                                        name: "Thòng Lọng Lạnh",
                                                        item_value: 0.0000,
                                                        sequence: 65,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114452",
                                                        name: "Thòng Lọng Nóng",
                                                        item_value: 0.0000,
                                                        sequence: 66,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114453",
                                                        name: "Kiềm Sinh Thiết",
                                                        item_value: 0.0000,
                                                        sequence: 67,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114454",
                                                        name: "Clip Cầm Máu",
                                                        item_value: 0.0000,
                                                        sequence: 68,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114455",
                                                        name: "Kim Chích Nâng",
                                                        item_value: 0.0000,
                                                        sequence: 69,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114456",
                                                        name: "Clo-test",
                                                        item_value: 0.0000,
                                                        sequence: 70,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114457",
                                                        name: "Thuốc An Thần (Propofol)",
                                                        item_value: 0.0000,
                                                        sequence: 71,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114458",
                                                        name: "Thuốc An Thần (Fentanyl)",
                                                        item_value: 0.0000,
                                                        sequence: 72,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114459",
                                                        name: "Thuốc Xổ",
                                                        item_value: 0.0000,
                                                        sequence: 73,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C1144510",
                                                        name: "Găng Tay Y Tế",
                                                        item_value: 0.0000,
                                                        sequence: 74,
                                                        children: []
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1145",
                                        name: "Khám Lâm Sàng",
                                        item_value: null,
                                        sequence: 75,
                                        children: [
                                            {
                                                key: "C11451",
                                                name: "Nội Tổng Quát",
                                                item_value: 184303.4620,
                                                sequence: 76,
                                                children: []
                                            },
                                            {
                                                key: "C11452",
                                                name: "Nội Tiêu Hoá",
                                                item_value: 0.0000,
                                                sequence: 77,
                                                children: []
                                            },
                                            {
                                                key: "C11453",
                                                name: "Tiền Mê",
                                                item_value: 0.0000,
                                                sequence: 78,
                                                children: []
                                            },
                                            {
                                                key: "C11454",
                                                name: "Khám Mắt",
                                                item_value: 0.0000,
                                                sequence: 79,
                                                children: []
                                            },
                                            {
                                                key: "C11455",
                                                name: "Tai Mũi Họng",
                                                item_value: 0.0000,
                                                sequence: 80,
                                                children: []
                                            },
                                            {
                                                key: "C11456",
                                                name: "Phụ Khoa",
                                                item_value: 0.0000,
                                                sequence: 81,
                                                children: []
                                            },
                                            {
                                                key: "C11457",
                                                name: "Răng Hàm Mặt",
                                                item_value: 0.0000,
                                                sequence: 82,
                                                children: []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                key: "C115",
                                name: "Thuốc",
                                item_value: null,
                                sequence: 83,
                                children: [
                                    {
                                        key: "C1151",
                                        name: "Thuốc Bảo Hiểm",
                                        item_value: 0.0000,
                                        sequence: 84,
                                        children: []
                                    },
                                    {
                                        key: "C1152",
                                        name: "Thuốc Dịch Vụ",
                                        item_value: 0.0000,
                                        sequence: 85,
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                key: "DTTT",
                name: "Doanh Thu Thực Tế",
                item_value: null,
                sequence: 3,
                children: [
                    {
                        key: "C11",
                        name: "Doctor Check Cá Nhân",
                        item_value: null,
                        sequence: 3,
                        children: [
                            {
                                key: "C111",
                                name: "Gói Nam",
                                item_value: null,
                                sequence: 4,
                                children: [
                                    {
                                        key: "C1111",
                                        name: "Gói Tiêu Chuẩn (Nam)",
                                        item_value: 0.0000,
                                        sequence: 5,
                                        children: []
                                    },
                                    {
                                        key: "C1112",
                                        name: "Gói Chuyên Sâu (Nam)",
                                        item_value: 2320666.6666,
                                        sequence: 6,
                                        children: []
                                    },
                                    {
                                        key: "C1113",
                                        name: "Gói VIP (Nam)",
                                        item_value: 4190485.5321,
                                        sequence: 7,
                                        children: []
                                    },
                                    {
                                        key: "C1114",
                                        name: "Gói Premium (Nam)",
                                        item_value: 0.0000,
                                        sequence: 8,
                                        children: []
                                    },
                                    {
                                        key: "C1115",
                                        name: "Gói Trường Thọ (Nam)",
                                        item_value: 0.0000,
                                        sequence: 9,
                                        children: []
                                    }
                                ]
                            },
                            {
                                key: "C112",
                                name: "Gói Nữ",
                                item_value: null,
                                sequence: 10,
                                children: [
                                    {
                                        key: "C1121",
                                        name: "Gói Tiêu Chuẩn (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 11,
                                        children: []
                                    },
                                    {
                                        key: "C1122",
                                        name: "Gói Chuyên Sâu (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 12,
                                        children: []
                                    },
                                    {
                                        key: "C1123",
                                        name: "Gói VIP (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 13,
                                        children: []
                                    },
                                    {
                                        key: "C1124",
                                        name: "Gói Premium (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 14,
                                        children: []
                                    },
                                    {
                                        key: "C1125",
                                        name: "Gói Trường Thọ (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 15,
                                        children: []
                                    }
                                ]
                            },
                            {
                                key: "C113",
                                name: "Gói Lẻ",
                                item_value: null,
                                sequence: 16,
                                children: [
                                    {
                                        key: "C1131",
                                        name: "Tầm soát ung thư dạ dày",
                                        item_value: 0.0000,
                                        sequence: 17,
                                        children: []
                                    },
                                    {
                                        key: "C1132",
                                        name: "Tầm soát ung thư đại tràng",
                                        item_value: 0.0000,
                                        sequence: 18,
                                        children: []
                                    },
                                    {
                                        key: "C1133",
                                        name: "Tầm soát ung thư ống tiêu hoá",
                                        item_value: 0.0000,
                                        sequence: 19,
                                        children: []
                                    },
                                    {
                                        key: "C1134",
                                        name: "Tầm soát ung thư gan",
                                        item_value: 0.0000,
                                        sequence: 20,
                                        children: []
                                    },
                                    {
                                        key: "C1135",
                                        name: "Tầm soát yếu tố nguy cơ đột quỵ",
                                        item_value: 0.0000,
                                        sequence: 21,
                                        children: []
                                    },
                                    {
                                        key: "C1136",
                                        name: "Tầm soát ung thư phổi",
                                        item_value: 0.0000,
                                        sequence: 22,
                                        children: []
                                    },
                                    {
                                        key: "C1137",
                                        name: "Tầm soát ung thư vú",
                                        item_value: 0.0000,
                                        sequence: 23,
                                        children: []
                                    },
                                    {
                                        key: "C1138",
                                        name: "Tầm soát ung thư cổ tử cung",
                                        item_value: 0.0000,
                                        sequence: 24,
                                        children: []
                                    },
                                    {
                                        key: "C1139",
                                        name: "Chích ngừa cúm",
                                        item_value: 0.0000,
                                        sequence: 25,
                                        children: []
                                    }
                                ]
                            },
                            {
                                key: "C114",
                                name: "Dịch Vụ Lẻ",
                                item_value: null,
                                sequence: 26,
                                children: [
                                    {
                                        key: "C1141",
                                        name: "Xét Nghiệm",
                                        item_value: null,
                                        sequence: 27,
                                        children: [
                                            {
                                                key: "C11411",
                                                name: "Xét Nghiệm Huyết Học",
                                                item_value: null,
                                                sequence: 28,
                                                children: [
                                                    {
                                                        key: "C114111",
                                                        name: "Đông Máu",
                                                        item_value: 398358.6337,
                                                        sequence: 29,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114112",
                                                        name: "Công Thức Máu",
                                                        item_value: 903592.9498,
                                                        sequence: 30,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11412",
                                                name: "Xét Nghiệm Miễn Dịch",
                                                item_value: 5898586.3400,
                                                sequence: 31,
                                                children: []
                                            },
                                            {
                                                key: "C11413",
                                                name: "Xét Nghiệm Nước Tiểu",
                                                item_value: 703592.9498,
                                                sequence: 32,
                                                children: []
                                            },
                                            {
                                                key: "C11414",
                                                name: "Xét Nghiệm Soi Phân",
                                                item_value: 0.0000,
                                                sequence: 33,
                                                children: []
                                            },
                                            {
                                                key: "C11415",
                                                name: "Xét Nghiệm Vi Sinh",
                                                item_value: 0.0000,
                                                sequence: 34,
                                                children: []
                                            },
                                            {
                                                key: "C11416",
                                                name: "Xét Nghiệm Sinh Học Phân Tử",
                                                item_value: 0.0000,
                                                sequence: 35,
                                                children: []
                                            },
                                            {
                                                key: "C11417",
                                                name: "Xét Nghiệm Sinh Hoá",
                                                item_value: 9057725.9729,
                                                sequence: 36,
                                                children: []
                                            },
                                            {
                                                key: "C11418",
                                                name: "Xét Nghiệm Hơi Thở",
                                                item_value: 0.0000,
                                                sequence: 37,
                                                children: []
                                            },
                                            {
                                                key: "C114190",
                                                name: "Xét Nghiệm Giải Phẫu Bệnh",
                                                item_value: 395000.0000,
                                                sequence: 38,
                                                children: []
                                            },
                                            {
                                                key: "C114191",
                                                name: "Xét Nghiệm Ký Sinh Trùng",
                                                item_value: 0.0000,
                                                sequence: 39,
                                                children: []
                                            },
                                            {
                                                key: "C114192",
                                                name: "Cấy Vi Trùng & Kháng Sinh Đồ",
                                                item_value: 0.0000,
                                                sequence: 40,
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1142",
                                        name: "Chẩn Đoán Hình Ảnh",
                                        item_value: null,
                                        sequence: 41,
                                        children: [
                                            {
                                                key: "C11421",
                                                name: "X Quang",
                                                item_value: 1266467.3096,
                                                sequence: 42,
                                                children: []
                                            },
                                            {
                                                key: "C11422",
                                                name: "Siêu Âm",
                                                item_value: 8533202.7569,
                                                sequence: 43,
                                                children: []
                                            },
                                            {
                                                key: "C11423",
                                                name: "CT",
                                                item_value: 0.0000,
                                                sequence: 44,
                                                children: []
                                            },
                                            {
                                                key: "C11424",
                                                name: "Đo Loãng Xương",
                                                item_value: 0.0000,
                                                sequence: 45,
                                                children: []
                                            },
                                            {
                                                key: "C11425",
                                                name: "Nhũ Ảnh",
                                                item_value: 0.0000,
                                                sequence: 46,
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1143",
                                        name: "Thăm Dò Chức Năng",
                                        item_value: null,
                                        sequence: 47,
                                        children: [
                                            {
                                                key: "C11431",
                                                name: "Điện Tim",
                                                item_value: 364432.8097,
                                                sequence: 48,
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1144",
                                        name: "Nội Soi",
                                        item_value: null,
                                        sequence: 49,
                                        children: [
                                            {
                                                key: "C11441",
                                                name: "Dạ Dày",
                                                item_value: null,
                                                sequence: 50,
                                                children: [
                                                    {
                                                        key: "C114411",
                                                        name: "Thường",
                                                        item_value: 0.0000,
                                                        sequence: 51,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114412",
                                                        name: "Mê",
                                                        item_value: 0.0000,
                                                        sequence: 52,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11442",
                                                name: "Đại Tràng",
                                                item_value: null,
                                                sequence: 53,
                                                children: [
                                                    {
                                                        key: "C114421",
                                                        name: "Thường",
                                                        item_value: 0.0000,
                                                        sequence: 54,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114422",
                                                        name: "Mê",
                                                        item_value: 0.0000,
                                                        sequence: 55,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11443",
                                                name: "Trực Tràng",
                                                item_value: 0.0000,
                                                sequence: 56,
                                                children: []
                                            },
                                            {
                                                key: "C11446",
                                                name: "Cặp",
                                                item_value: null,
                                                sequence: 57,
                                                children: [
                                                    {
                                                        key: "C114461",
                                                        name: "Thường",
                                                        item_value: 0.0000,
                                                        sequence: 58,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114462",
                                                        name: "Mê",
                                                        item_value: 3856694.4580,
                                                        sequence: 59,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11444",
                                                name: "Thủ Thuật Nội Soi",
                                                item_value: null,
                                                sequence: 60,
                                                children: [
                                                    {
                                                        key: "C114441",
                                                        name: "Công Cắt Polyp",
                                                        item_value: 0.0000,
                                                        sequence: 61,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114442",
                                                        name: "Sinh Thiết Trọn",
                                                        item_value: 0.0000,
                                                        sequence: 62,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11445",
                                                name: "Vật Tư Y Tế",
                                                item_value: null,
                                                sequence: 64,
                                                children: [
                                                    {
                                                        key: "C114451",
                                                        name: "Thòng Lọng Lạnh",
                                                        item_value: 0.0000,
                                                        sequence: 65,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114452",
                                                        name: "Thòng Lọng Nóng",
                                                        item_value: 0.0000,
                                                        sequence: 66,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114453",
                                                        name: "Kiềm Sinh Thiết",
                                                        item_value: 0.0000,
                                                        sequence: 67,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114454",
                                                        name: "Clip Cầm Máu",
                                                        item_value: 0.0000,
                                                        sequence: 68,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114455",
                                                        name: "Kim Chích Nâng",
                                                        item_value: 0.0000,
                                                        sequence: 69,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114456",
                                                        name: "Clo-test",
                                                        item_value: 0.0000,
                                                        sequence: 70,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114457",
                                                        name: "Thuốc An Thần (Propofol)",
                                                        item_value: 0.0000,
                                                        sequence: 71,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114458",
                                                        name: "Thuốc An Thần (Fentanyl)",
                                                        item_value: 0.0000,
                                                        sequence: 72,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114459",
                                                        name: "Thuốc Xổ",
                                                        item_value: 0.0000,
                                                        sequence: 73,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C1144510",
                                                        name: "Găng Tay Y Tế",
                                                        item_value: 0.0000,
                                                        sequence: 74,
                                                        children: []
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1145",
                                        name: "Khám Lâm Sàng",
                                        item_value: null,
                                        sequence: 75,
                                        children: [
                                            {
                                                key: "C11451",
                                                name: "Nội Tổng Quát",
                                                item_value: 1715696.5379,
                                                sequence: 76,
                                                children: []
                                            },
                                            {
                                                key: "C11452",
                                                name: "Nội Tiêu Hoá",
                                                item_value: 0.0000,
                                                sequence: 77,
                                                children: []
                                            },
                                            {
                                                key: "C11453",
                                                name: "Tiền Mê",
                                                item_value: 0.0000,
                                                sequence: 78,
                                                children: []
                                            },
                                            {
                                                key: "C11454",
                                                name: "Khám Mắt",
                                                item_value: 0.0000,
                                                sequence: 79,
                                                children: []
                                            },
                                            {
                                                key: "C11455",
                                                name: "Tai Mũi Họng",
                                                item_value: 0.0000,
                                                sequence: 80,
                                                children: []
                                            },
                                            {
                                                key: "C11456",
                                                name: "Phụ Khoa",
                                                item_value: 0.0000,
                                                sequence: 81,
                                                children: []
                                            },
                                            {
                                                key: "C11457",
                                                name: "Răng Hàm Mặt",
                                                item_value: 0.0000,
                                                sequence: 82,
                                                children: []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                key: "C115",
                                name: "Thuốc",
                                item_value: null,
                                sequence: 83,
                                children: [
                                    {
                                        key: "C1151",
                                        name: "Thuốc Bảo Hiểm",
                                        item_value: 0.0000,
                                        sequence: 84,
                                        children: []
                                    },
                                    {
                                        key: "C1152",
                                        name: "Thuốc Dịch Vụ",
                                        item_value: 2972800.0000,
                                        sequence: 85,
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                key: "GV",
                name: "Giá Vốn",
                item_value: null,
                sequence: 4,
                children: [
                    {
                        key: "C11",
                        name: "Doctor Check Cá Nhân",
                        item_value: null,
                        sequence: 3,
                        children: [
                            {
                                key: "C111",
                                name: "Gói Nam",
                                item_value: null,
                                sequence: 4,
                                children: [
                                    {
                                        key: "C1111",
                                        name: "Gói Tiêu Chuẩn (Nam)",
                                        item_value: 0.0000,
                                        sequence: 5,
                                        children: []
                                    },
                                    {
                                        key: "C1112",
                                        name: "Gói Chuyên Sâu (Nam)",
                                        item_value: 737176.0000,
                                        sequence: 6,
                                        children: []
                                    },
                                    {
                                        key: "C1113",
                                        name: "Gói VIP (Nam)",
                                        item_value: 1357847.0000,
                                        sequence: 7,
                                        children: []
                                    },
                                    {
                                        key: "C1114",
                                        name: "Gói Premium (Nam)",
                                        item_value: 0.0000,
                                        sequence: 8,
                                        children: []
                                    },
                                    {
                                        key: "C1115",
                                        name: "Gói Trường Thọ (Nam)",
                                        item_value: 0.0000,
                                        sequence: 9,
                                        children: []
                                    }
                                ]
                            },
                            {
                                key: "C112",
                                name: "Gói Nữ",
                                item_value: null,
                                sequence: 10,
                                children: [
                                    {
                                        key: "C1121",
                                        name: "Gói Tiêu Chuẩn (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 11,
                                        children: []
                                    },
                                    {
                                        key: "C1122",
                                        name: "Gói Chuyên Sâu (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 12,
                                        children: []
                                    },
                                    {
                                        key: "C1123",
                                        name: "Gói VIP (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 13,
                                        children: []
                                    },
                                    {
                                        key: "C1124",
                                        name: "Gói Premium (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 14,
                                        children: []
                                    },
                                    {
                                        key: "C1125",
                                        name: "Gói Trường Thọ (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 15,
                                        children: []
                                    }
                                ]
                            },
                            {
                                key: "C113",
                                name: "Gói Lẻ",
                                item_value: null,
                                sequence: 16,
                                children: [
                                    {
                                        key: "C1131",
                                        name: "Tầm soát ung thư dạ dày",
                                        item_value: 0.0000,
                                        sequence: 17,
                                        children: []
                                    },
                                    {
                                        key: "C1132",
                                        name: "Tầm soát ung thư đại tràng",
                                        item_value: 0.0000,
                                        sequence: 18,
                                        children: []
                                    },
                                    {
                                        key: "C1133",
                                        name: "Tầm soát ung thư ống tiêu hoá",
                                        item_value: 0.0000,
                                        sequence: 19,
                                        children: []
                                    },
                                    {
                                        key: "C1134",
                                        name: "Tầm soát ung thư gan",
                                        item_value: 0.0000,
                                        sequence: 20,
                                        children: []
                                    },
                                    {
                                        key: "C1135",
                                        name: "Tầm soát yếu tố nguy cơ đột quỵ",
                                        item_value: 0.0000,
                                        sequence: 21,
                                        children: []
                                    },
                                    {
                                        key: "C1136",
                                        name: "Tầm soát ung thư phổi",
                                        item_value: 0.0000,
                                        sequence: 22,
                                        children: []
                                    },
                                    {
                                        key: "C1137",
                                        name: "Tầm soát ung thư vú",
                                        item_value: 0.0000,
                                        sequence: 23,
                                        children: []
                                    },
                                    {
                                        key: "C1138",
                                        name: "Tầm soát ung thư cổ tử cung",
                                        item_value: 0.0000,
                                        sequence: 24,
                                        children: []
                                    },
                                    {
                                        key: "C1139",
                                        name: "Chích ngừa cúm",
                                        item_value: 0.0000,
                                        sequence: 25,
                                        children: []
                                    }
                                ]
                            },
                            {
                                key: "C114",
                                name: "Dịch Vụ Lẻ",
                                item_value: null,
                                sequence: 26,
                                children: [
                                    {
                                        key: "C1141",
                                        name: "Xét Nghiệm",
                                        item_value: null,
                                        sequence: 27,
                                        children: [
                                            {
                                                key: "C11411",
                                                name: "Xét Nghiệm Huyết Học",
                                                item_value: null,
                                                sequence: 28,
                                                children: [
                                                    {
                                                        key: "C114111",
                                                        name: "Đông Máu",
                                                        item_value: 163451.0000,
                                                        sequence: 29,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114112",
                                                        name: "Công Thức Máu",
                                                        item_value: 570650.0000,
                                                        sequence: 30,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11412",
                                                name: "Xét Nghiệm Miễn Dịch",
                                                item_value: 3559995.0000,
                                                sequence: 31,
                                                children: []
                                            },
                                            {
                                                key: "C11413",
                                                name: "Xét Nghiệm Nước Tiểu",
                                                item_value: 108000.0000,
                                                sequence: 32,
                                                children: []
                                            },
                                            {
                                                key: "C11414",
                                                name: "Xét Nghiệm Soi Phân",
                                                item_value: 0.0000,
                                                sequence: 33,
                                                children: []
                                            },
                                            {
                                                key: "C11415",
                                                name: "Xét Nghiệm Vi Sinh",
                                                item_value: 0.0000,
                                                sequence: 34,
                                                children: []
                                            },
                                            {
                                                key: "C11416",
                                                name: "Xét Nghiệm Sinh Học Phân Tử",
                                                item_value: 0.0000,
                                                sequence: 35,
                                                children: []
                                            },
                                            {
                                                key: "C11417",
                                                name: "Xét Nghiệm Sinh Hoá",
                                                item_value: 2042532.0000,
                                                sequence: 36,
                                                children: []
                                            },
                                            {
                                                key: "C11418",
                                                name: "Xét Nghiệm Hơi Thở",
                                                item_value: 0.0000,
                                                sequence: 37,
                                                children: []
                                            },
                                            {
                                                key: "C114190",
                                                name: "Xét Nghiệm Giải Phẫu Bệnh",
                                                item_value: 0.0000,
                                                sequence: 38,
                                                children: []
                                            },
                                            {
                                                key: "C114191",
                                                name: "Xét Nghiệm Ký Sinh Trùng",
                                                item_value: 0.0000,
                                                sequence: 39,
                                                children: []
                                            },
                                            {
                                                key: "C114192",
                                                name: "Cấy Vi Trùng & Kháng Sinh Đồ",
                                                item_value: 0.0000,
                                                sequence: 40,
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1142",
                                        name: "Chẩn Đoán Hình Ảnh",
                                        item_value: null,
                                        sequence: 41,
                                        children: [
                                            {
                                                key: "C11421",
                                                name: "X Quang",
                                                item_value: 12768.0000,
                                                sequence: 42,
                                                children: []
                                            },
                                            {
                                                key: "C11422",
                                                name: "Siêu Âm",
                                                item_value: 98904.0000,
                                                sequence: 43,
                                                children: []
                                            },
                                            {
                                                key: "C11423",
                                                name: "CT",
                                                item_value: 0.0000,
                                                sequence: 44,
                                                children: []
                                            },
                                            {
                                                key: "C11424",
                                                name: "Đo Loãng Xương",
                                                item_value: 0.0000,
                                                sequence: 45,
                                                children: []
                                            },
                                            {
                                                key: "C11425",
                                                name: "Nhũ Ảnh",
                                                item_value: 0.0000,
                                                sequence: 46,
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1143",
                                        name: "Thăm Dò Chức Năng",
                                        item_value: null,
                                        sequence: 47,
                                        children: [
                                            {
                                                key: "C11431",
                                                name: "Điện Tim",
                                                item_value: 21000.0000,
                                                sequence: 48,
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1144",
                                        name: "Nội Soi",
                                        item_value: null,
                                        sequence: 49,
                                        children: [
                                            {
                                                key: "C11441",
                                                name: "Dạ Dày",
                                                item_value: null,
                                                sequence: 50,
                                                children: [
                                                    {
                                                        key: "C114411",
                                                        name: "Thường",
                                                        item_value: 0.0000,
                                                        sequence: 51,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114412",
                                                        name: "Mê",
                                                        item_value: 0.0000,
                                                        sequence: 52,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11442",
                                                name: "Đại Tràng",
                                                item_value: null,
                                                sequence: 53,
                                                children: [
                                                    {
                                                        key: "C114421",
                                                        name: "Thường",
                                                        item_value: 0.0000,
                                                        sequence: 54,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114422",
                                                        name: "Mê",
                                                        item_value: 0.0000,
                                                        sequence: 55,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11443",
                                                name: "Trực Tràng",
                                                item_value: 0.0000,
                                                sequence: 56,
                                                children: []
                                            },
                                            {
                                                key: "C11446",
                                                name: "Cặp",
                                                item_value: null,
                                                sequence: 57,
                                                children: [
                                                    {
                                                        key: "C114461",
                                                        name: "Thường",
                                                        item_value: 0.0000,
                                                        sequence: 58,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114462",
                                                        name: "Mê",
                                                        item_value: 429203.0000,
                                                        sequence: 59,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11444",
                                                name: "Thủ Thuật Nội Soi",
                                                item_value: null,
                                                sequence: 60,
                                                children: [
                                                    {
                                                        key: "C114441",
                                                        name: "Công Cắt Polyp",
                                                        item_value: 0.0000,
                                                        sequence: 61,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114442",
                                                        name: "Sinh Thiết Trọn",
                                                        item_value: 0.0000,
                                                        sequence: 62,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11445",
                                                name: "Vật Tư Y Tế",
                                                item_value: null,
                                                sequence: 64,
                                                children: [
                                                    {
                                                        key: "C114451",
                                                        name: "Thòng Lọng Lạnh",
                                                        item_value: 0.0000,
                                                        sequence: 65,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114452",
                                                        name: "Thòng Lọng Nóng",
                                                        item_value: 0.0000,
                                                        sequence: 66,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114453",
                                                        name: "Kiềm Sinh Thiết",
                                                        item_value: 0.0000,
                                                        sequence: 67,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114454",
                                                        name: "Clip Cầm Máu",
                                                        item_value: 0.0000,
                                                        sequence: 68,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114455",
                                                        name: "Kim Chích Nâng",
                                                        item_value: 0.0000,
                                                        sequence: 69,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114456",
                                                        name: "Clo-test",
                                                        item_value: 0.0000,
                                                        sequence: 70,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114457",
                                                        name: "Thuốc An Thần (Propofol)",
                                                        item_value: 0.0000,
                                                        sequence: 71,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114458",
                                                        name: "Thuốc An Thần (Fentanyl)",
                                                        item_value: 0.0000,
                                                        sequence: 72,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114459",
                                                        name: "Thuốc Xổ",
                                                        item_value: 0.0000,
                                                        sequence: 73,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C1144510",
                                                        name: "Găng Tay Y Tế",
                                                        item_value: 0.0000,
                                                        sequence: 74,
                                                        children: []
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1145",
                                        name: "Khám Lâm Sàng",
                                        item_value: null,
                                        sequence: 75,
                                        children: [
                                            {
                                                key: "C11451",
                                                name: "Nội Tổng Quát",
                                                item_value: 220000.0000,
                                                sequence: 76,
                                                children: []
                                            },
                                            {
                                                key: "C11452",
                                                name: "Nội Tiêu Hoá",
                                                item_value: 0.0000,
                                                sequence: 77,
                                                children: []
                                            },
                                            {
                                                key: "C11453",
                                                name: "Tiền Mê",
                                                item_value: 0.0000,
                                                sequence: 78,
                                                children: []
                                            },
                                            {
                                                key: "C11454",
                                                name: "Khám Mắt",
                                                item_value: 0.0000,
                                                sequence: 79,
                                                children: []
                                            },
                                            {
                                                key: "C11455",
                                                name: "Tai Mũi Họng",
                                                item_value: 0.0000,
                                                sequence: 80,
                                                children: []
                                            },
                                            {
                                                key: "C11456",
                                                name: "Phụ Khoa",
                                                item_value: 0.0000,
                                                sequence: 81,
                                                children: []
                                            },
                                            {
                                                key: "C11457",
                                                name: "Răng Hàm Mặt",
                                                item_value: 0.0000,
                                                sequence: 82,
                                                children: []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                key: "C115",
                                name: "Thuốc",
                                item_value: null,
                                sequence: 83,
                                children: [
                                    {
                                        key: "C1151",
                                        name: "Thuốc Bảo Hiểm",
                                        item_value: 0.0000,
                                        sequence: 84,
                                        children: []
                                    },
                                    {
                                        key: "C1152",
                                        name: "Thuốc Dịch Vụ",
                                        item_value: 115556.0000,
                                        sequence: 85,
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                key: "LNG",
                name: "Lợi Nhuận Gộp",
                item_value: null,
                sequence: 5,
                children: [
                    {
                        key: "C11",
                        name: "Doctor Check Cá Nhân",
                        item_value: null,
                        sequence: 3,
                        children: [
                            {
                                key: "C111",
                                name: "Gói Nam",
                                item_value: null,
                                sequence: 4,
                                children: [
                                    {
                                        key: "C1111",
                                        name: "Gói Tiêu Chuẩn (Nam)",
                                        item_value: 0.0000,
                                        sequence: 5,
                                        children: []
                                    },
                                    {
                                        key: "C1112",
                                        name: "Gói Chuyên Sâu (Nam)",
                                        item_value: 1583490.6666,
                                        sequence: 6,
                                        children: []
                                    },
                                    {
                                        key: "C1113",
                                        name: "Gói VIP (Nam)",
                                        item_value: 2832638.5321,
                                        sequence: 7,
                                        children: []
                                    },
                                    {
                                        key: "C1114",
                                        name: "Gói Premium (Nam)",
                                        item_value: 0.0000,
                                        sequence: 8,
                                        children: []
                                    },
                                    {
                                        key: "C1115",
                                        name: "Gói Trường Thọ (Nam)",
                                        item_value: 0.0000,
                                        sequence: 9,
                                        children: []
                                    }
                                ]
                            },
                            {
                                key: "C112",
                                name: "Gói Nữ",
                                item_value: null,
                                sequence: 10,
                                children: [
                                    {
                                        key: "C1121",
                                        name: "Gói Tiêu Chuẩn (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 11,
                                        children: []
                                    },
                                    {
                                        key: "C1122",
                                        name: "Gói Chuyên Sâu (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 12,
                                        children: []
                                    },
                                    {
                                        key: "C1123",
                                        name: "Gói VIP (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 13,
                                        children: []
                                    },
                                    {
                                        key: "C1124",
                                        name: "Gói Premium (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 14,
                                        children: []
                                    },
                                    {
                                        key: "C1125",
                                        name: "Gói Trường Thọ (Nữ)",
                                        item_value: 0.0000,
                                        sequence: 15,
                                        children: []
                                    }
                                ]
                            },
                            {
                                key: "C113",
                                name: "Gói Lẻ",
                                item_value: null,
                                sequence: 16,
                                children: [
                                    {
                                        key: "C1131",
                                        name: "Tầm soát ung thư dạ dày",
                                        item_value: 0.0000,
                                        sequence: 17,
                                        children: []
                                    },
                                    {
                                        key: "C1132",
                                        name: "Tầm soát ung thư đại tràng",
                                        item_value: 0.0000,
                                        sequence: 18,
                                        children: []
                                    },
                                    {
                                        key: "C1133",
                                        name: "Tầm soát ung thư ống tiêu hoá",
                                        item_value: 0.0000,
                                        sequence: 19,
                                        children: []
                                    },
                                    {
                                        key: "C1134",
                                        name: "Tầm soát ung thư gan",
                                        item_value: 0.0000,
                                        sequence: 20,
                                        children: []
                                    },
                                    {
                                        key: "C1135",
                                        name: "Tầm soát yếu tố nguy cơ đột quỵ",
                                        item_value: 0.0000,
                                        sequence: 21,
                                        children: []
                                    },
                                    {
                                        key: "C1136",
                                        name: "Tầm soát ung thư phổi",
                                        item_value: 0.0000,
                                        sequence: 22,
                                        children: []
                                    },
                                    {
                                        key: "C1137",
                                        name: "Tầm soát ung thư vú",
                                        item_value: 0.0000,
                                        sequence: 23,
                                        children: []
                                    },
                                    {
                                        key: "C1138",
                                        name: "Tầm soát ung thư cổ tử cung",
                                        item_value: 0.0000,
                                        sequence: 24,
                                        children: []
                                    },
                                    {
                                        key: "C1139",
                                        name: "Chích ngừa cúm",
                                        item_value: 0.0000,
                                        sequence: 25,
                                        children: []
                                    }
                                ]
                            },
                            {
                                key: "C114",
                                name: "Dịch Vụ Lẻ",
                                item_value: null,
                                sequence: 26,
                                children: [
                                    {
                                        key: "C1141",
                                        name: "Xét Nghiệm",
                                        item_value: null,
                                        sequence: 27,
                                        children: [
                                            {
                                                key: "C11411",
                                                name: "Xét Nghiệm Huyết Học",
                                                item_value: null,
                                                sequence: 28,
                                                children: [
                                                    {
                                                        key: "C114111",
                                                        name: "Đông Máu",
                                                        item_value: 234907.6337,
                                                        sequence: 29,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114112",
                                                        name: "Công Thức Máu",
                                                        item_value: 332942.9498,
                                                        sequence: 30,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11412",
                                                name: "Xét Nghiệm Miễn Dịch",
                                                item_value: 2338591.3400,
                                                sequence: 31,
                                                children: []
                                            },
                                            {
                                                key: "C11413",
                                                name: "Xét Nghiệm Nước Tiểu",
                                                item_value: 595592.9498,
                                                sequence: 32,
                                                children: []
                                            },
                                            {
                                                key: "C11414",
                                                name: "Xét Nghiệm Soi Phân",
                                                item_value: 0.0000,
                                                sequence: 33,
                                                children: []
                                            },
                                            {
                                                key: "C11415",
                                                name: "Xét Nghiệm Vi Sinh",
                                                item_value: 0.0000,
                                                sequence: 34,
                                                children: []
                                            },
                                            {
                                                key: "C11416",
                                                name: "Xét Nghiệm Sinh Học Phân Tử",
                                                item_value: 0.0000,
                                                sequence: 35,
                                                children: []
                                            },
                                            {
                                                key: "C11417",
                                                name: "Xét Nghiệm Sinh Hoá",
                                                item_value: 7015193.9729,
                                                sequence: 36,
                                                children: []
                                            },
                                            {
                                                key: "C11418",
                                                name: "Xét Nghiệm Hơi Thở",
                                                item_value: 0.0000,
                                                sequence: 37,
                                                children: []
                                            },
                                            {
                                                key: "C114190",
                                                name: "Xét Nghiệm Giải Phẫu Bệnh",
                                                item_value: 395000.0000,
                                                sequence: 38,
                                                children: []
                                            },
                                            {
                                                key: "C114191",
                                                name: "Xét Nghiệm Ký Sinh Trùng",
                                                item_value: 0.0000,
                                                sequence: 39,
                                                children: []
                                            },
                                            {
                                                key: "C114192",
                                                name: "Cấy Vi Trùng & Kháng Sinh Đồ",
                                                item_value: 0.0000,
                                                sequence: 40,
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1142",
                                        name: "Chẩn Đoán Hình Ảnh",
                                        item_value: null,
                                        sequence: 41,
                                        children: [
                                            {
                                                key: "C11421",
                                                name: "X Quang",
                                                item_value: 1253699.3096,
                                                sequence: 42,
                                                children: []
                                            },
                                            {
                                                key: "C11422",
                                                name: "Siêu Âm",
                                                item_value: 8434298.7569,
                                                sequence: 43,
                                                children: []
                                            },
                                            {
                                                key: "C11423",
                                                name: "CT",
                                                item_value: 0.0000,
                                                sequence: 44,
                                                children: []
                                            },
                                            {
                                                key: "C11424",
                                                name: "Đo Loãng Xương",
                                                item_value: 0.0000,
                                                sequence: 45,
                                                children: []
                                            },
                                            {
                                                key: "C11425",
                                                name: "Nhũ Ảnh",
                                                item_value: 0.0000,
                                                sequence: 46,
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1143",
                                        name: "Thăm Dò Chức Năng",
                                        item_value: null,
                                        sequence: 47,
                                        children: [
                                            {
                                                key: "C11431",
                                                name: "Điện Tim",
                                                item_value: 343432.8097,
                                                sequence: 48,
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1144",
                                        name: "Nội Soi",
                                        item_value: null,
                                        sequence: 49,
                                        children: [
                                            {
                                                key: "C11441",
                                                name: "Dạ Dày",
                                                item_value: null,
                                                sequence: 50,
                                                children: [
                                                    {
                                                        key: "C114411",
                                                        name: "Thường",
                                                        item_value: 0.0000,
                                                        sequence: 51,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114412",
                                                        name: "Mê",
                                                        item_value: 0.0000,
                                                        sequence: 52,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11442",
                                                name: "Đại Tràng",
                                                item_value: null,
                                                sequence: 53,
                                                children: [
                                                    {
                                                        key: "C114421",
                                                        name: "Thường",
                                                        item_value: 0.0000,
                                                        sequence: 54,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114422",
                                                        name: "Mê",
                                                        item_value: 0.0000,
                                                        sequence: 55,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11443",
                                                name: "Trực Tràng",
                                                item_value: 0.0000,
                                                sequence: 56,
                                                children: []
                                            },
                                            {
                                                key: "C11446",
                                                name: "Cặp",
                                                item_value: null,
                                                sequence: 57,
                                                children: [
                                                    {
                                                        key: "C114461",
                                                        name: "Thường",
                                                        item_value: 0.0000,
                                                        sequence: 58,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114462",
                                                        name: "Mê",
                                                        item_value: 3427491.4580,
                                                        sequence: 59,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11444",
                                                name: "Thủ Thuật Nội Soi",
                                                item_value: null,
                                                sequence: 60,
                                                children: [
                                                    {
                                                        key: "C114441",
                                                        name: "Công Cắt Polyp",
                                                        item_value: 0.0000,
                                                        sequence: 61,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114442",
                                                        name: "Sinh Thiết Trọn",
                                                        item_value: 0.0000,
                                                        sequence: 62,
                                                        children: []
                                                    }
                                                ]
                                            },
                                            {
                                                key: "C11445",
                                                name: "Vật Tư Y Tế",
                                                item_value: null,
                                                sequence: 64,
                                                children: [
                                                    {
                                                        key: "C114451",
                                                        name: "Thòng Lọng Lạnh",
                                                        item_value: 0.0000,
                                                        sequence: 65,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114452",
                                                        name: "Thòng Lọng Nóng",
                                                        item_value: 0.0000,
                                                        sequence: 66,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114453",
                                                        name: "Kiềm Sinh Thiết",
                                                        item_value: 0.0000,
                                                        sequence: 67,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114454",
                                                        name: "Clip Cầm Máu",
                                                        item_value: 0.0000,
                                                        sequence: 68,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114455",
                                                        name: "Kim Chích Nâng",
                                                        item_value: 0.0000,
                                                        sequence: 69,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114456",
                                                        name: "Clo-test",
                                                        item_value: 0.0000,
                                                        sequence: 70,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114457",
                                                        name: "Thuốc An Thần (Propofol)",
                                                        item_value: 0.0000,
                                                        sequence: 71,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114458",
                                                        name: "Thuốc An Thần (Fentanyl)",
                                                        item_value: 0.0000,
                                                        sequence: 72,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C114459",
                                                        name: "Thuốc Xổ",
                                                        item_value: 0.0000,
                                                        sequence: 73,
                                                        children: []
                                                    },
                                                    {
                                                        key: "C1144510",
                                                        name: "Găng Tay Y Tế",
                                                        item_value: 0.0000,
                                                        sequence: 74,
                                                        children: []
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        key: "C1145",
                                        name: "Khám Lâm Sàng",
                                        item_value: null,
                                        sequence: 75,
                                        children: [
                                            {
                                                key: "C11451",
                                                name: "Nội Tổng Quát",
                                                item_value: 1495696.5379,
                                                sequence: 76,
                                                children: []
                                            },
                                            {
                                                key: "C11452",
                                                name: "Nội Tiêu Hoá",
                                                item_value: 0.0000,
                                                sequence: 77,
                                                children: []
                                            },
                                            {
                                                key: "C11453",
                                                name: "Tiền Mê",
                                                item_value: 0.0000,
                                                sequence: 78,
                                                children: []
                                            },
                                            {
                                                key: "C11454",
                                                name: "Khám Mắt",
                                                item_value: 0.0000,
                                                sequence: 79,
                                                children: []
                                            },
                                            {
                                                key: "C11455",
                                                name: "Tai Mũi Họng",
                                                item_value: 0.0000,
                                                sequence: 80,
                                                children: []
                                            },
                                            {
                                                key: "C11456",
                                                name: "Phụ Khoa",
                                                item_value: 0.0000,
                                                sequence: 81,
                                                children: []
                                            },
                                            {
                                                key: "C11457",
                                                name: "Răng Hàm Mặt",
                                                item_value: 0.0000,
                                                sequence: 82,
                                                children: []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                key: "C115",
                                name: "Thuốc",
                                item_value: null,
                                sequence: 83,
                                children: [
                                    {
                                        key: "C1151",
                                        name: "Thuốc Bảo Hiểm",
                                        item_value: 0.0000,
                                        sequence: 84,
                                        children: []
                                    },
                                    {
                                        key: "C1152",
                                        name: "Thuốc Dịch Vụ",
                                        item_value: 2857244.0000,
                                        sequence: 85,
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                key: "CPMKT",
                name: "Chi Phí Bán Hàng & MKT",
                item_value: null,
                sequence: 6,
                children: []
            },
            {
                key: "CPQLDN",
                name: "Chi Phí Quản Lý Doanh Nghiệp",
                item_value: null,
                sequence: 7,
                children: []
            },
            {
                key: "LNTHDKD",
                name: "Lợi Nhuận Thuần Từ Hoạt Động Kinh Doanh",
                item_value: null,
                sequence: 8,
                children: []
            }
  ];