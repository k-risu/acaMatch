export interface AddressDto {
  address: string;
  detailAddress: string;
  postNum: string;
}

export interface Class {
  classId: number;
  className: string;
  classComment: string;
  classStartDate: string;
  classEndDate: string;
  classStartTime: string;
  classEndTime: string;
  classPrice: number;
  classDay: string | null | undefined;
  classCategoryName: string | null | undefined;
  userCertification?: number;
  productId?: number;
}

export interface Review {
  reviewId: number;
  classId: number;
  className: string;
  acaId: number;
  userId: number;
  writerName: string;
  writerPic: string;
  comment: string;
  star: number;
  createdAt: string;
  myReviewCount: number;
  banReview: number;
  reviewPic: string;

  reviewComment?: string;
  reviewStar?: number;
  reviewCreatedAt?: string;
  reviewUpdatedAt?: string;
  reviewUserId?: number;
  reviewUserNickName?: string;
  reviewClassName?: string;
  joinClassId?: number;
  reviewPics?: string[];
  totalGeneralReviewCount?: number;
  totalMediaReviewCount?: number;
  type?: string;
}

export interface AcademyResponse {
  resultMessage: string;
  resultData: {
    acaId: number;
    acaName: string;
    acaPic: string;
    address: string;
    acaPhone: string;
    teacherNum: number;
    comments: string;
    star: number;
    reviewCount: number;
    likeCount: number;
    isLiked: boolean;
    addressDto: AddressDto;
    classes: Class[];
    generalReviews: Review[]; // reviews -> generalReviews
    mediaReviews: Review[]; // 추가
    generalReviewCount: number; // 추가
    mediaReviewCount: number; // 추가
  };
}

export interface Book {
  bookId: number;
  bookName: string;
  bookWriter: string;
  bookPublisher: string;
  bookPrice: number;
  bookPic?: string;
  bookAmount: number;
  bookComment: string;
  manager: string;
  classId: number;
  productId: number;
}

export interface AcademyData {
  acaId: number;
  acaName: string;
  acaPic: string;
  address: string;
  acaPhone: string;
  teacherNum: number;
  comments: string;
  star: number;
  reviewCount: number;
  likeCount: number;
  isLiked: boolean;
  addressDto: AddressDto;
  classes: Class[];
  generalReviews: Review[]; // reviews -> generalReviews
  mediaReviews: Review[]; // 추가
  generalReviewCount: number; // 추가
  mediaReviewCount: number; // 추가
  books?: Book[];
  acaPics?: string[];
}

export interface MapPosition {
  lat: number;
  lng: number;
}

export interface KakaoMapProps {
  address: string;
  height?: string;
  level?: number;
}
