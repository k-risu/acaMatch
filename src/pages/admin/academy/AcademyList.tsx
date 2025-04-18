import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userInfo from "../../../atoms/userInfo";
import { Button, Form, Input, message, Pagination, Select } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Cookies } from "react-cookie";
import jwtAxios from "../../../apis/jwt";
import CustomModal from "../../../components/modal/Modal";
import { FaPen, FaRegTrashAlt } from "react-icons/fa";

interface myAcademyListType {
  acaName: string;
  acaPic: string;
  acaPics: string;
  comment: string;
  createdAt: string;
  acaPhone: string;
  address: string;
  userId: number;
  name: string;
  reportsCount: number;
  acaId: number;
  acaAgree: number;
}

function AcademyList() {
  const [form] = Form.useForm();
  const cookies = new Cookies();
  const currentUserInfo = useRecoilValue(userInfo);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [academyId, setAcademyId] = useState<number>(0);
  const [myAcademyList, setMyAcademyList] = useState<myAcademyListType[]>([]);
  const [myAcademyCount, setMyAcademyCount] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const state = parseInt(searchParams.get("state") || "1", 0);
  const search = searchParams.get("search");
  const showCnt = parseInt(searchParams.get("showCnt") || "10", 0);

  //학원 목록
  const academyTotalList = async (page: number) => {
    try {
      if (currentUserInfo.roleId === 0) {
        //전체 관리자일 때
        const res = await jwtAxios.get(
          "/api/academy/GetAcademyInfoByAcaNameClassNameExamNameAcaAgree?page=" +
            (page ? page : 1) +
            (search !== null ? "&acaName=" + search : "") +
            (showCnt !== null ? "&size=" + showCnt : "") +
            (state !== null ? "&acaAgree=" + state : ""),
        );
        setMyAcademyList(res.data.resultData);
        setMyAcademyCount(res.data.resultData[0].totalCount);
        //console.log("admin : ", res.data.resultData);
      } else {
        const res = await axios.get(
          `/api/academy/getAcademyListByUserId?signedUserId=${currentUserInfo.userId}`,
        );
        setMyAcademyList(res.data.resultData);
        setMyAcademyCount(res.data.resultData[0].totalCount);
        //console.log(res.data.resultData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //학원삭제 팝업
  const handleAcademyDelete = (acaId: number) => {
    setAcademyId(acaId);
    setIsModalVisible(true);
  };

  //학원 삭제
  const DeleteAcademy = async (academyId: number) => {
    //alert(academyId);
    try {
      //alert("학원 삭제" + acaId + currentUserInfo.userId);
      const res = await jwtAxios.delete(
        `/api/academy?acaId=${academyId}&userId=${currentUserInfo.userId}`,
      );
      //console.log(res.data.resultData);

      if (res.data.resultData === 1) {
        message.success("등록된 학원을 삭제하였습니다.");
        academyTotalList(currentPage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //학원삭제 확인
  const handleButton1Click = () => {
    setIsModalVisible(false);
  };
  const handleButton2Click = () => {
    DeleteAcademy(academyId);
    setIsModalVisible(false);
  };

  //학원 검색
  const onFinished = async (values: any) => {
    //학원 목록
    try {
      if (currentUserInfo.roleId === 0) {
        //전체 관리자일 때
        const res = await jwtAxios.get(
          "/api/academy/GetAcademyInfoByAcaNameClassNameExamNameAcaAgree" +
            (values.search !== null ? "?acaName=" + values.search : "") +
            (values.state !== null ? "&acaAgree=" + values.state : "") +
            (values.showCnt !== null ? "&size=" + values.showCnt : ""),
        );
        setMyAcademyList(res.data.resultData);
        setMyAcademyCount(res.data.resultData[0].totalCount);
        //console.log("admin : ", res.data.resultData);
      } else {
        const res = await axios.get(
          "/api/academy/getAcademyListByUserId?signedUserId=" +
            currentUserInfo.userId +
            (values.search !== null ? "&acaName=" + values.search : "") +
            (values.state !== null ? "&acaAgree=" + values.state : ""),
        );
        setMyAcademyList(res.data.resultData);
        setMyAcademyCount(res.data.resultData[0].totalCount);
        //console.log("academy : ", res.data.resultData);
      }
    } catch (error) {
      console.log(error);
    }

    // 쿼리 문자열로 변환
    const queryParams = new URLSearchParams(values).toString();
    navigate(`../academy?${queryParams}`); //쿼리스트링 url에 추가
  };

  const onChange = () => {
    form.submit();
  };

  //페이지 처리
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // 페이지 변경
    academyTotalList(page);
  };

  useEffect(() => {
    academyTotalList(currentPage);

    //페이지 들어오면 ant design 처리용 기본값 세팅
    form.setFieldsValue({
      state: 1,
      search: search ? search : "",
      showCnt: 10,
    });
  }, []);

  useEffect(() => {
    if (!cookies.get("accessToken") || currentUserInfo.roleId === 1) {
      navigate("-");
      message.error("로그인이 필요한 서비스입니다.");
    }
  }, []);

  return (
    <div className="flex gap-5 w-full justify-center align-top">
      <div className="w-full">
        <h1 className="title-admin-font">
          학원 등록/수정
          <p>학원 관리 &gt; 학원 등록/수정</p>
        </h1>

        <div className="board-wrap">
          <Form form={form} onFinish={values => onFinished(values)}>
            <div className="flex justify-between w-full p-3 border-b">
              <div className="flex items-center gap-1">
                <label className="w-24 text-sm">학원 검색</label>

                <Form.Item name="state" className="mb-0">
                  <Select
                    showSearch
                    placeholder="처리상태"
                    optionFilterProp="label"
                    className="select-admin-basic"
                    options={[
                      {
                        value: "",
                        label: "전체",
                      },
                      {
                        value: 0,
                        label: "승인대기",
                      },
                      {
                        value: 1,
                        label: "승인완료",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="search" className="mb-0">
                  <Input
                    className="input-admin-basic w-60"
                    placeholder="검색어를 입력해 주세요."
                  />
                </Form.Item>

                <Button htmlType="submit" className="btn-admin-basic">
                  검색하기
                </Button>
              </div>

              <div className="flex gap-2">
                <Form.Item name="showCnt" className="mb-0">
                  <Select
                    showSearch
                    placeholder="10개씩 보기"
                    optionFilterProp="label"
                    className="select-admin-basic"
                    onChange={onChange}
                    // onSearch={onSearch}
                    options={[
                      {
                        value: 10,
                        label: "10개씩 보기",
                      },
                      {
                        value: 20,
                        label: "20개씩 보기",
                      },
                      {
                        value: 50,
                        label: "50개씩 보기",
                      },
                    ]}
                  />
                </Form.Item>

                <Button
                  className="btn-admin-basic"
                  onClick={() => navigate("/admin/academy-add")}
                >
                  + 학원 신규등록
                </Button>
              </div>
            </div>
          </Form>
          <div className="flex justify-between align-middle p-2 border-b bg-gray-100">
            <div className="flex items-center justify-center w-full">
              학원명
            </div>
            <div className="flex items-center justify-center min-w-24">
              등록일
            </div>
            <div className="flex items-center justify-center min-w-32">
              학원 연락처
            </div>
            <div className="flex items-center justify-center min-w-48">
              학원 주소
            </div>
            <div className="flex items-center justify-center min-w-24">
              담당자
            </div>
            <div className="flex items-center justify-center min-w-20">
              신고 횟수
            </div>
            {/* <div className="flex items-center justify-center min-w-24">
              승인
            </div> */}
            <div className="flex items-center justify-center min-w-20">
              강의 관리
            </div>
            <div className="flex items-center justify-center min-w-20">
              강사 관리
            </div>
            <div className="flex items-center justify-center min-w-20">
              관리
            </div>
          </div>

          {!myAcademyList && (
            <div className="p-4 text-center border-b">
              등록된 학원이 없습니다.
            </div>
          )}

          {myAcademyList?.map((item, index) => (
            <div
              key={index}
              className="loop-content flex justify-between align-middle p-2 border-b"
            >
              <div className="flex justify-start items-center w-full">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate(`../class?acaId=${item.acaId}`)}
                >
                  <div className="flex justify-center items-center w-14 min-w-14 h-14 rounded-xl bg-gray-300 overflow-hidden">
                    <img
                      src={
                        item.acaPic && item.acaPic !== "default_user.jpg"
                          ? `http://112.222.157.157:5233/pic/academy/${item.acaId}/${item.acaPic}`
                          : "/aca_image_1.png"
                      }
                      className="max-w-fit max-h-full object-cover"
                      alt=" /"
                    />
                  </div>
                  <div>
                    <div className="flex mb-0.5">
                      {item.acaAgree === 1 ? (
                        <span className="flex items-center pl-1.5 pr-1.5 text-[12px] bg-gray-300 rounded-md">
                          승인완료
                        </span>
                      ) : (
                        <span className="flex items-center pl-1.5 pr-1.5 text-[12px] bg-red-400 rounded-md text-white">
                          승인대기
                        </span>
                      )}
                    </div>
                    {item?.acaName}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center text-center min-w-24">
                {item.createdAt.substr(0, 10)}
              </div>
              <div className="flex items-center justify-center text-center min-w-32">
                {item.acaPhone}
              </div>
              <div className="flex items-center justify-center text-center min-w-48">
                {item.address}
              </div>
              <div className="flex items-center justify-center min-w-24">
                {item.name}
              </div>
              <div className="flex items-center justify-center min-w-20">
                {item.reportsCount}회
              </div>
              <div className="flex items-center justify-center min-w-20">
                {item.acaAgree === 1 ? (
                  <button
                    className="small_line_button"
                    onClick={() => navigate(`../class?acaId=${item.acaId}`)}
                  >
                    강의관리
                  </button>
                ) : (
                  "승인대기"
                )}
              </div>
              <div className="flex items-center justify-center min-w-20">
                {item.acaAgree === 1 ? (
                  <button
                    className="small_line_button"
                    onClick={() => navigate(`../teacher?acaId=${item.acaId}`)}
                  >
                    강사관리
                  </button>
                ) : (
                  "-"
                )}
              </div>
              {/* <div className="flex items-center justify-center min-w-24">
                {item.acaAgree === 1 ? (
                  <span className="text-sm text-blue-500">승인완료</span>
                ) : (
                  <span className="text-sm text-red-300">승인대기</span>
                )}
              </div> */}
              <div className="flex gap-4 items-center justify-center min-w-20">
                <button
                  onClick={() =>
                    navigate(`../academy/edit?acaId=${item.acaId}`)
                  }
                >
                  <FaPen className="w-3 text-gray-400" />
                </button>
                <button
                  //onClick={e => DeleteAcademy(item.acaId)}
                  onClick={() => handleAcademyDelete(item.acaId)}
                >
                  <FaRegTrashAlt className="w-3 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center m-6 mb-10">
          <Pagination
            total={myAcademyCount}
            current={currentPage} // 현재 페이지 번호
            pageSize={showCnt} // 한 페이지에 표시할 항목 수
            onChange={handlePageChange} // 페이지 변경 시 호출되는 핸들러
            showSizeChanger={false}
          />
        </div>
      </div>

      <CustomModal
        visible={isModalVisible}
        title={"학원 삭제하기"}
        content={"선택하신 학원을 삭제하시겠습니까?"}
        onButton1Click={handleButton1Click}
        onButton2Click={handleButton2Click}
        button1Text={"취소하기"}
        button2Text={"삭제하기"}
        modalWidth={400}
      />
    </div>
  );
}

export default AcademyList;
