import { Form, message, Pagination, Select } from "antd";
import { useEffect, useState } from "react";
import { GoStar, GoStarFill } from "react-icons/go";
import { useRecoilValue } from "recoil";
import userInfo from "../../../atoms/userInfo";
import axios from "axios";
import { Cookies } from "react-cookie";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomModal from "../../../components/modal/Modal";

interface ademyReviewListType {
  classId: number;
  className: string;
  userId: number;
  writerName: string;
  writerPic: string;
  comment: string;
  star: number;
  createdAt: string;
  acaId: number;
  reviewCount: number;
  reviewId: number;
}

interface myAcademyListType {
  acaId: number;
  acaName: string;
}

function AcademyReview() {
  const cookies = new Cookies();
  const [form] = Form.useForm();
  const [academyReviewList, setAcademyReviewList] = useState<
    ademyReviewListType[]
  >([]); //학원리뷰 목록
  const [resultMessage, setResultMessage] = useState("");
  //const [reviewId, setReviewId] = useState();
  const [searchParams, _] = useSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [myAcademyList, setMyAcademyList] = useState<myAcademyListType[]>([]);
  const { roleId, userId } = useRecoilValue(userInfo);
  const navigate = useNavigate();

  const acaId = parseInt(searchParams.get("acaId") || "0", 0);
  const classId = parseInt(searchParams.get("classId") || "0", 0);

  //전체학원 목록
  const academyList = async () => {
    try {
      if (roleId === 0) {
        //전체 관리자일 때
        const res = await axios.get(`/api/menuOut/academy`);
        setMyAcademyList(res.data.resultData);
      } else {
        const res = await axios.get(
          `/api/academy/getAcademyListByUserId?signedUserId=${userId}`,
        );
        setMyAcademyList(res.data.resultData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // acaId와 acaName만 남기기
  const simplifiedData = myAcademyList.map(
    ({ acaId: value, acaName: label }) => ({
      value,
      label,
    }),
  );

  const handleButton1Click = () => {
    setIsModalVisible(false);
  };
  const handleButton2Click = async () => {
    try {
      const res = await axios.delete(
        `/api/review/academy?acaId=${acaId}&joinClassId=${classId}&userId=${userId}`,
      );
      console.log(res.data.resultData);
      setIsModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  //학원 텍스트 리뷰 목록
  const getTagList = async (values: any) => {
    try {
      const res = await axios.get(
        `/api/review/academy/noPic?acaId=${values.acaId}&page=1&size=${values.showCnt}`,
      );
      setAcademyReviewList(res.data.resultData);
    } catch (error) {
      console.log(error);
    }
  };

  //리뷰 삭제하기
  const deleteReviewCheck = (acaId: number, classId: number) => {
    setResultMessage(
      `리뷰(${acaId}/${classId})를 삭제하시면 복구할 수 없습니다. 해당 리뷰를 삭제하시겠습니까?`,
    );
    setIsModalVisible(true);
  };

  const onFinished = async (values: any) => {
    // 쿼리 문자열로 변환
    const queryParams = new URLSearchParams(values).toString();
    navigate(`?${queryParams}`); //쿼리스트링 url에 추가

    getTagList(values);
  };

  const onChange = () => {
    //setCurrentPage(1);
    form.submit();
  };

  useEffect(() => {
    getTagList({ acaId: 0, showCnt: 10 });
  }, [userId]);

  useEffect(() => {
    if (!cookies.get("accessToken")) {
      navigate("/log-in");
      message.error("로그인이 필요한 서비스입니다.");
    }

    //페이지 들어오면 ant design 처리용 기본값 세팅
    form.setFieldsValue({
      acaId: acaId ? acaId : null,
      showCnt: 10,
    });

    academyList(); //학원 목록
  }, []);

  return (
    <div className="flex gap-5 w-full justify-center align-top">
      <div className="w-full">
        <h1 className="title-admin-font">
          학원 텍스트 리뷰
          <p>학원 관리 &gt; 학원 텍스트 리뷰</p>
        </h1>

        <div className="board-wrap">
          <Form form={form} onFinish={values => onFinished(values)}>
            <div className="flex justify-between w-full p-3 border-b">
              <div className="flex items-center gap-1">
                <label className="mr-3 text-sm">학원 선택</label>
                <Form.Item name="acaId" className="mb-0">
                  <Select
                    showSearch
                    placeholder="학원 선택"
                    optionFilterProp="label"
                    className="select-admin-basic !min-w-52"
                    onChange={onChange}
                    options={simplifiedData}
                  />
                </Form.Item>
              </div>

              <div className="flex gap-2">
                <Form.Item name="showCnt" className="mb-0">
                  <Select
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
              </div>
            </div>
          </Form>

          <div className="flex justify-between align-middle p-2 border-b bg-gray-100">
            <div className="flex items-center justify-center w-full">
              리뷰 내용
            </div>
            <div className="flex items-center justify-center w-40">
              삭제하기
            </div>
          </div>

          {!academyReviewList && (
            <div className="p-4 text-center border-b">
              등록된 학원리뷰가 없습니다.
            </div>
          )}
          {academyReviewList?.length === 0 && (
            <div className="p-4 text-center border-b">
              등록된 학원리뷰가 없습니다.
            </div>
          )}

          {academyReviewList?.map((item, index) => (
            <div
              key={index}
              className="loop-content flex justify-between align-middle p-6 border-b"
            >
              <div className="w-full">
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center w-10 h-10 border rounded-full overflow-hidden">
                    <img
                      src={
                        item.writerPic
                          ? `http://112.222.157.157:5233/pic/user/${item.userId}/${item.writerPic}`
                          : "/aca_image_1.png"
                      }
                      className="max-w-fit max-h-full object-cover"
                      alt=""
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{item.writerName}</div>
                    <div className="text-sm text-gray-500">
                      {item.createdAt.substr(0, 10)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 mb-3">
                  {Array.from({ length: 5 }, (_, index) =>
                    index < item.star ? <GoStarFill /> : <GoStar />,
                  )}
                </div>
                <div className="text-lg font-bold">
                  {item.className ? item.className : "학원 정보가 없습니다."}
                </div>
                <div className="text-sm text-gray-500">{item.comment}</div>
              </div>
              <div className="flex items-center justify-center min-w-40">
                <button
                  className="small_line_button"
                  onClick={() => deleteReviewCheck(item.acaId, item.classId)}
                >
                  삭제하기
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center m-6 mb-10">
          <Pagination
            defaultCurrent={1}
            total={academyReviewList?.length}
            showSizeChanger={false}
          />
        </div>

        <CustomModal
          visible={isModalVisible}
          title={"리뷰 삭제하기"}
          content={<div className="addOk">{resultMessage}</div>}
          onButton1Click={handleButton1Click}
          onButton2Click={handleButton2Click}
          button1Text={"취소하기"}
          button2Text={"삭제하기"}
          modalWidth={400}
        />
      </div>
    </div>
  );
}

export default AcademyReview;
