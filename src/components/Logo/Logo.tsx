import { AppConfig } from "../../utils/AppConfig";

type ILogoProps = {
  xl?: boolean;
};

const Logo = (props: ILogoProps) => {
  const size = props.xl ? "44" : "32";
  const fontStyle = props.xl
    ? "font-semibold text-3xl"
    : "font-semibold text-xl";
  const fillColor = "fill-yellow-400 hover:fill-yellow-500";

  return (
    <span className={`inline-flex items-center ${fontStyle}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2"
        version="1.1"
        id="Layer_1"
        x="174.43155749511718"
        y="153.59481811523438"
        viewBox="169 167 262 263"
        enableBackground="new 0 0 600 600"
        height={size}
        width={size}
        preserveAspectRatio="xMinYMin"
        style={{ overflow: "visible" }}
      >
        <path
          fill="#0B1C38"
          d="M431,298h-10c0-66.7-54.3-121-121-121s-121,54.3-121,121h-10c0-72.2,58.8-131,131-131S431,225.8,431,298z"
          className={`${fillColor} opacity-100`}
        ></path>
        <path
          fill="#0B1C38"
          d="M171,316c0.4,3.5,1,7,1.7,10.4h254.6c0.7-3.4,1.3-6.9,1.7-10.4H171z"
          className={`${fillColor} opacity-80`}
        ></path>
        <path
          fill="#0B1C38"
          d="M176.9,341.9c1.2,3.5,2.6,7,4,10.4h238.1c1.5-3.4,2.8-6.8,4-10.4H176.9z"
          className={`${fillColor} opacity-70`}
        ></path>
        <path
          fill="#0B1C38"
          d="M189.1,367.8c2.2,3.6,4.5,7,7.1,10.4h207.7c2.5-3.3,4.9-6.8,7.1-10.4H189.1z"
          className={`${fillColor} opacity-50`}
        ></path>
        <path
          fill="#0B1C38"
          d="M377.9,404.1c4.3-3.2,8.3-6.7,12.2-10.4H209.9c3.8,3.7,7.9,7.2,12.2,10.4H377.9z"
          className={`${fillColor} opacity-40`}
        ></path>
        <path
          fill="#0B1C38"
          d="M249.1,419.6c15.6,6.7,32.9,10.4,50.9,10.4c18.1,0,35.3-3.7,50.9-10.4H249.1z"
          className={`${fillColor} opacity-20`}
        ></path>
      </svg>
      <p className="text-yellow-500">{AppConfig.site_name}</p>
    </span>
  );
};

export { Logo };
