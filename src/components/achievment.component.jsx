import React from "react";
import BoxComponent from "./box.component";
import FileImage from "../../public/file.jpg";

const AchievmentComponent = ({ item }) => {
  const statusColor = () => {
    if (item.status == "Tekshirilmoqda") {
      return "bg-orange-600";
    }
    if (item.status == "Tasdiqlandi") {
      return "bg-green-600";
    }
    if (item.status == "Tasdiqlanmadi") {
      return "bg-red-600";
    }
  };
  return (
    <BoxComponent>
      <h1 className="text-primary text-xl font-[600] ">
        {item.from.job.title}
      </h1>
      <small className="mb-3">{item.from.job.workplace}</small>
      <div className="section my-3 font-bold flex items-center justify-between">
        <h1>{item.achievments.section}</h1>
        <div
          className={`${statusColor()} text-[14px] py-1 px-2 rounded-md font-semibold text-white`}
        >
          {item.status}
        </div>
      </div>
      <div className="title mt-3 flex item-center justify-between font-semibold">
        <h1>{item.achievments.title}</h1>
        <p>{item.achievments.rating.ratingTitle}</p>
      </div>
      <div className="file mt-2">
        <a
          href={`http://45.134.39.117:7474${item.fileUrl}`}
          className="flex items-center gap-3"
        >
          <img src={FileImage} alt="" width={50} height={50} />
          <p>Fileni ko'rish</p>
        </a>
      </div>
    </BoxComponent>
  );
};

export default AchievmentComponent;
