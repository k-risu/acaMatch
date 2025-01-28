import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userInfo from "../../../atoms/userInfo";
import SideBar from "../../../components/SideBar";
import { Pagination } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";

function AcademyClassList() {
  const currentUserInfo = useRecoilValue(userInfo);
  const [classList, setClassList] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const acaId = searchParams.get("acaId");

  const menuItems = [
    { label: "회원정보 관리", isActive: false, link: "/mypage/user" },
    { label: "학원정보 관리", isActive: true, link: "/mypage/academy" },
    /*
    {
      label: "학원학생 관리",
      isActive: false,
      link: "/mypage/academy/student",
    },
    */
    {
      label: "학원리뷰 목록",
      isActive: false,
      link: "/mypage/academy/review",
    },
    { label: "좋아요 목록", isActive: false, link: "/mypage/academy/like" },
  ];

  const academyClassList = async () => {
    try {
      const res = await axios.get(`/api/acaClass?acaId=${acaId}&page=1`);
      setClassList(res.data.resultData);
      console.log(res.data.resultData);
    } catch (error) {
      console.log(error);
    }
  };

  //학원 상세보기 이동
  const detailAcademy = (acaId: number) => {
    navigate(`/academy/detail?id=${acaId}`);
  };

  useEffect(() => {
    academyClassList();
  }, []);

  return (
    <div className="flex gap-5 w-full justify-center align-top">
      <SideBar menuItems={menuItems} />

      <div className="w-full">
        <h1 className="title-font flex justify-between align-middle">
          "학원명"의 강좌목록
          <button
            className="flex items-center gap-1 mr-5 text-sm font-normal"
            onClick={() => navigate(`/mypage/academy/classAdd?acaId=${acaId}`)}
          >
            강좌 신규등록
            <FaPlusCircle />
          </button>
        </h1>
        <div className="w-full gap-0 border border-b-0 rounded-lg overflow-hidden">
          <div className="flex justify-between align-middle p-4 border-b">
            <div className="flex items-center justify-center w-full">
              강좌명
            </div>
            <div className="flex items-center justify-center w-60">시작일</div>
            <div className="flex items-center justify-center w-60">종료일</div>
            <div className="flex items-center justify-center w-40">
              테스트 관리
            </div>
          </div>

          {classList.map((item: never, index: number) => (
            <div
              key={index}
              className="loop-content flex justify-between align-middle p-4 border-b"
            >
              <div className="flex justify-start items-center w-full">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() =>
                    navigate(`/mypage/academy/student?id=${item.classId}`)
                  }
                >
                  <img src="/aca_image_1.png" alt="" />
                  {item.acaPic}
                  {item.className}
                </div>
              </div>
              <div className="flex items-center justify-center w-60">
                {item.startDate}
              </div>
              <div className="flex items-center justify-center w-60">
                {item.endDate}
              </div>
              <div className="flex items-center justify-center w-40">
                <button
                  className="small_line_button"
                  onClick={() => navigate("/mypage/academy/testList?classId=1")}
                >
                  테스트 목록
                </button>
              </div>
            </div>
          ))}
        </div>
        response에서 학원명 필요, classId 정보 없어서 테스트 목록 호출
        불가(쿼리스트링으로 전달)
        <div className="flex justify-center items-center m-6 mb-10">
          <Pagination
            defaultCurrent={1}
            total={classList.length}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
}

export default AcademyClassList;
