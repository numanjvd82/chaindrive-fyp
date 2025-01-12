import { FunctionComponent } from "react";

const Header: FunctionComponent = () => {
  return (
    <div
      className={`h-[800px] relative bg-white w-full overflow-hidden shrink-0 flex flex-col items-start justify-end pt-[158.2px] pb-0 pl-[579px] pr-0 box-border gap-[71.2px] leading-[normal] tracking-[normal] text-left text-base text-darkslategray-200 font-poppins mq450:gap-[18px] mq450:pl-5 mq450:box-border mq900:gap-9 mq900:pl-[289px] mq900:box-border ${className}`}
    >
      <footer className="self-stretch flex flex-col items-start justify-start pt-[73px] pb-[91.8px] pl-0 pr-px box-border relative gap-[26px] max-w-full shrink-0 text-left text-base text-darkslategray-100 font-poppins mq700:pt-[47px] mq700:pb-[60px] mq700:box-border">
        <div className="w-[1120px] flex flex-row items-start justify-start pt-0 px-0 pb-[131px] box-border max-w-[131%]">
          <div className="flex-1 flex flex-row items-center justify-between max-w-full gap-5">
            <div className="flex flex-row items-center justify-start gap-[5px] text-dodgerblue-100">
              <img
                className="h-[25.7px] w-6 relative overflow-hidden shrink-0"
                loading="lazy"
                alt=""
                src="/frame.svg"
              />
              <div className="h-[11px] relative leading-[150%] font-semibold inline-block min-w-[95px]">
                <span>Chain</span>
                <span className="text-black">Drive</span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center gap-10 max-w-full mq700:gap-5 mq900:hidden">
              <div className="h-[11px] relative leading-[11px] font-medium inline-block">
                Become a renter
              </div>
              <div className="h-[11px] relative leading-[11px] font-medium inline-block">
                Rental deals
              </div>
              <div className="h-[11px] relative leading-[11px] font-medium inline-block">
                How it work
              </div>
              <div className="h-[11px] relative leading-[11px] font-medium inline-block">
                Why choose us
              </div>
            </div>
            <div className="flex flex-row items-center justify-start gap-6">
              <div className="h-[11px] relative leading-[150%] font-medium inline-block">
                Sign in
              </div>
              <div className="rounded-lg bg-dodgerblue-100 flex flex-row items-center justify-center py-4 px-[31px] text-white">
                <div className="h-[11px] relative leading-[11px] font-medium inline-block">
                  Sign up
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[371.2px] h-full absolute !m-[0] top-[0px] right-[0.8px] bottom-[0px]">
          <img
            className="absolute top-[0px] left-[217px] w-[803px] h-[866px] overflow-hidden z-[1]"
            loading="lazy"
            alt=""
            src="/frame-1.svg"
          />
          <img
            className="absolute top-[215px] left-[0px] w-[1048px] h-[537px] object-cover z-[2]"
            alt=""
            src="/car-2-1@2x.png"
          />
        </div>
        <div className="w-[390px] flex flex-row items-start justify-start relative max-w-full text-29xl text-gray-800">
          <h1 className="m-0 flex-1 relative text-inherit leading-[100%] font-semibold font-[inherit] inline-block max-w-full mq450:text-10xl mq450:leading-[29px] mq900:text-19xl mq900:leading-[38px]">
            <span>Find, book and rent a car</span>
            <span className="text-dodgerblue-100"> Easily</span>
          </h1>
          <img
            className="h-[47.7px] w-[134.2px] absolute !m-[0] right-[9.5px] bottom-[-25.7px] object-contain z-[1]"
            loading="lazy"
            alt=""
            src="/vector-1.svg"
          />
        </div>
        <div className="w-[390px] relative text-lg leading-[150%] text-gray-500 inline-block max-w-full">{`We connects car renters and owners with a secure, transparent, and efficient blockchain-powered platform. `}</div>
        <div className="rounded-lg bg-dodgerblue-100 flex flex-row items-start justify-start py-[18.5px] px-8 text-white">
          <div className="h-[11px] relative leading-[11px] font-medium inline-block min-w-[99px]">
            Get Started
          </div>
        </div>
      </footer>
      <div className="shadow-[0px_6px_12px_rgba(19,_94,_172,_0.12)] rounded-xl bg-white overflow-x-auto flex flex-row items-center justify-start py-3 pl-[31px] pr-3 box-border gap-[50px] max-w-full z-[3] mq450:gap-[25px]">
        <div className="w-[255.7px] flex flex-row items-center justify-start py-0 px-0 box-border gap-4">
          <img
            className="h-8 w-8 relative"
            alt=""
            src="/vuesaxlinearlocation.svg"
          />
          <div className="w-[278px] flex flex-col items-start justify-start pt-0 pb-1 pl-0 pr-5 box-border gap-3 shrink-0">
            <div className="h-[11px] relative leading-[150%] font-medium inline-block shrink-0">
              Location
            </div>
            <div className="h-2.5 relative text-sm leading-[150%] text-silver inline-block shrink-0">
              Search your location
            </div>
          </div>
        </div>
        <div className="border-darkgray-100 border-l-[1px] border-solid flex flex-row items-center justify-start py-0 pl-6 pr-0 gap-4">
          <img
            className="h-8 w-8 relative"
            alt=""
            src="/vuesaxlinearcalendar.svg"
          />
          <div className="w-[183px] flex flex-col items-start justify-start pt-0 pb-1 pl-0 pr-5 box-border gap-3">
            <div className="h-[11px] relative leading-[150%] font-medium inline-block shrink-0 min-w-[97px]">
              Pickup date
            </div>
            <div className="h-2.5 relative text-sm leading-[150%] text-silver inline-block shrink-0">
              Tue 15 Feb, 09:00
            </div>
          </div>
        </div>
        <div className="border-darkgray-100 border-l-[1px] border-solid flex flex-row items-center justify-start py-0.5 pl-6 pr-[75px] gap-4 mq450:pr-5 mq450:box-border">
          <img
            className="h-8 w-8 relative"
            alt=""
            src="/vuesaxlinearcalendar-1.svg"
          />
          <div className="flex flex-col items-start justify-start gap-3">
            <div className="h-[11px] relative leading-[150%] font-medium inline-block shrink-0">
              Return date
            </div>
            <div className="h-2.5 relative text-sm leading-[150%] text-silver inline-block shrink-0 min-w-[109px]">
              Thu 16 Feb, 11:00
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-dodgerblue-100 flex flex-row items-center justify-center py-[18.5px] px-[50px] text-white">
          <div className="h-[11px] relative leading-[11px] font-medium inline-block">
            Search
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
