import type { MenuProps } from "antd";
import { Dropdown, message } from "antd";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import jwtAxios from "../../apis/jwt";
import userInfo from "../../atoms/userInfo";
import { removeCookie } from "../../utils/cookie";

interface HeaderProps {
  className?: string;
  close: () => void;
  // isOpen: boolean;
  // menuItems: (MenuItem | Divider)[];
  // setMenuItems: React.Dispatch<React.SetStateAction<(MenuItem | Divider)[]>>;
}

const AdminHeader: React.FC<HeaderProps> = ({ className, close }) => {
  const setUserInfo = useSetRecoilState(userInfo);
  const currentUserInfo = useRecoilValue(userInfo);
  const [userPic, setUserPic] = useState<string>("");
  // const [_, setIsMessageModalOpen] = useState(false);
  // const [recipientType, setRecipientType] = useState<"student" | "academy">(
  //   "student",
  // );
  // const [messageContent, setMessageContent] = useState("");
  const cookies = new Cookies();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = cookies.get("accessToken");

    if (accessToken) {
      const fetchUserData = async () => {
        try {
          const response = await jwtAxios.get("/api/user", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const userData = {
            name: response.data.resultData.name,
            roleId: response.data.resultData.userRole,
            userId: response.data.resultData.userId,
          };

          //일반회원은 관리자 접근권한 없음
          if (userData.roleId === 1) {
            message.error("접근 권한(1)이 없습니다.");
            navigate("/");
            return;
          }

          setUserInfo(userData);
          setUserPic(response.data.resultData.userPic);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };
      fetchUserData();
    } else {
      //비회원은 접근제한
      message.error("잘못된 접근(1)입니다.");
      navigate("/log-in");
      return;
    }
  }, [setUserInfo]);

  // const handleSendMessage = () => {
  //   setIsMessageModalOpen(true);
  // };

  // const handleMessageSubmit = async () => {
  //   try {
  //     const response = await jwtAxios.post(
  //       `/api/academy-manager/send-attendance/class/2`,
  //       null,
  //       {
  //         params: {
  //           senderId: currentUserInfo.userId,
  //           message: messageContent,
  //         },
  //       },
  //     );

  //     if (response.data.resultMessage) {
  //       message.success("메시지가 성공적으로 전송되었습니다.");
  //       setIsMessageModalOpen(false);
  //       setMessageContent("");
  //       setRecipientType("student");
  //     }
  //   } catch (error) {
  //     console.error("메시지 전송 실패:", error);
  //     message.error("메시지 전송에 실패했습니다.");
  //   }
  // };

  // const MessageModalContent = (
  //   <div className="flex flex-col h-[200px] gap-4 mb-[90px]">
  //     <div className="mb-4">
  //       <p className="mb-2 font-medium">수신자 선택</p>
  //       <Radio.Group
  //         value={recipientType}
  //         onChange={e => setRecipientType(e.target.value)}
  //         className="flex gap-4"
  //       >
  //         <Radio value="student">학생</Radio>
  //         <Radio value="academy">학원관계자</Radio>
  //       </Radio.Group>
  //     </div>

  //     <div>
  //       <p className="mb-2 font-medium">메시지 내용</p>
  //       <Input.TextArea
  //         value={messageContent}
  //         onChange={e => setMessageContent(e.target.value)}
  //         placeholder="전송할 메시지를 입력해주세요."
  //         rows={6}
  //         maxLength={44}
  //         showCount
  //         style={{
  //           resize: "none",
  //         }}
  //       />
  //     </div>
  //   </div>
  // );

  const items: MenuProps["items"] = [
    // {
    //   key: "1",
    //   label: (
    //     <button onClick={handleSendMessage} className="w-full text-left">
    //       문자메시지 전송
    //     </button>
    //   ),
    // },
    {
      key: "2",
      label: (
        <button
          onClick={() => navigate("../admin/profile")}
          className="w-full text-left"
        >
          회원정보 수정
        </button>
      ),
    },
    {
      key: "3",
      label: (
        <button onClick={() => logOut()} className="w-full text-left">
          로그아웃
        </button>
      ),
    },
  ];

  //오늘날짜 확인
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1을 해줍니다.
  const day = String(today.getDate()).padStart(2, "0"); // 두 자릿수로 맞추기 위해 padStart 사용
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = daysOfWeek[today.getDay()];
  const todayDate = `${year}-${month}-${day}(${dayOfWeek})`;

  const logOut = async () => {
    try {
      await jwtAxios.post("/api/user/log-out", {});
      //console.log(res);
      removeCookie("accessToken");
      removeCookie("message");
      navigate("/");
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  return (
    <>
      <header
        className={`${className} relative w-full border-b bg-white transform transition-transform duration-300`}
      >
        <div
          className={`flex justify-between min-w-0 transition-all duration-300 w-[100%]`}
        >
          <div className="w-[60px] flex justify-center">
            <button
              className="rounded-md transform transition-transform duration-300"
              onClick={close}
            >
              <FiMenu className="w-[20px] h-[20px]" />
            </button>
          </div>
          <div className="flex gap-4 pr-3">
            <ul className="flex justify-center items-center gap-[12px] p-[12px]">
              {/* <li>
                <FaBell />
              </li> */}
              <li className="text-gray-500 text-sm">
                <span className="mr-1 text-sm">{todayDate} /</span>
                <span className="text-sm font-semibold">
                  {currentUserInfo.name}
                </span>
                님, 환영합니다.
              </li>
              <li className="w-[32px] h-[32px]">
                {currentUserInfo.userId && (
                  <Dropdown
                    menu={{ items }}
                    placement="bottomRight"
                    trigger={["click"]}
                    overlayStyle={{ minWidth: "150px" }}
                  >
                    {userPic ? (
                      <img
                        src={`http://112.222.157.157:5233/pic/user/${currentUserInfo.userId}/${userPic}`}
                        alt="프로필"
                        className="w-full h-full rounded-full object-cover cursor-pointer"
                      />
                    ) : (
                      <img
                        src="/aca_image_1.png"
                        className="w-full h-full rounded-full object-cover cursor-pointer"
                        alt=""
                      />
                    )}
                  </Dropdown>
                )}
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* <Sms /> */}
    </>
  );
};

export default AdminHeader;
