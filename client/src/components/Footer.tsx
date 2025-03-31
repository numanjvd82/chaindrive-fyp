const Footer: React.FC = () => {
  return (
    <div
      className={` w-full relative bg-blue-950 text-white overflow-hidden flex flex-col items-start justify-start pt-[41px] px-40 pb-[30px] box-border gap-[76.3px] leading-[normal] tracking-[normal] text-left text-xs text-lightgray font-poppins mq450:gap-[19px] mq450:pl-5 mq450:pr-5 mq450:box-border mq725:gap-[38px] mq725:pl-20 mq725:pr-20 mq725:box-border`}
    >
      <section className="w-[1064px] flex flex-row items-start justify-between max-w-full gap-5 text-left text-base text-grays-white font-poppins mq1050:flex-wrap">
        <div className="flex flex-col items-start justify-center gap-8">
          <div className="flex flex-row items-center justify-start gap-2">
            <div className="h-[25.7px] w-6 relative overflow-hidden shrink-0">
              <svg
                width="24"
                height="26"
                viewBox="0 0 24 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_4312_3319)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.8619 21.8954C11.6945 21.8954 10.5781 21.6747 9.55404 21.2711L5.87842 23.6625C7.88879 24.9656 10.2877 25.7219 12.8619 25.7219C17.6219 25.7219 21.7785 23.1363 24.0019 19.2928L20.6884 17.3786C19.125 20.0793 16.2056 21.8954 12.8619 21.8954Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.27734 3.28336L8.06235 12.8619L4.27734 22.4385L10.2538 18.5498L19.0006 12.8619L10.2538 7.1721L4.27734 3.28336Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.862 3.82651C16.2057 3.82651 19.1251 5.64264 20.6885 8.34326L24.002 6.42906C21.7766 2.58558 17.622 0 12.862 0C10.2858 0 7.88885 0.756249 5.87659 2.05941L9.5541 4.45074C10.5781 4.04716 11.6927 3.82651 12.862 3.82651Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.82885 20.9091L4.58274 16.4847L6.0198 12.86L4.58274 9.23717L2.82885 4.81284C1.05988 7.01558 0 9.81426 0 12.8619C0 15.9076 1.05988 18.7063 2.82885 20.9091Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_4312_3319">
                    <rect width="24" height="25.7219" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="h-[11px] relative leading-[150%] font-semibold inline-block">
              CHAINDRIVE
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-6 text-sm text-lightgray">
            <div className="w-[191px] flex flex-row items-center justify-start gap-2">
              <div className="h-6 w-6 relative">
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 14.1519C13.7231 14.1519 15.12 12.755 15.12 11.0319C15.12 9.30877 13.7231 7.9119 12 7.9119C10.2769 7.9119 8.88 9.30877 8.88 11.0319C8.88 12.755 10.2769 14.1519 12 14.1519Z"
                    stroke="#D6D6D6"
                    stroke-width="1.5"
                  />
                  <path
                    d="M3.62001 9.2119C5.59001 0.551896 18.42 0.561896 20.38 9.2219C21.53 14.3019 18.37 18.6019 15.6 21.2619C13.59 23.2019 10.41 23.2019 8.39001 21.2619C5.63001 18.6019 2.47001 14.2919 3.62001 9.2119Z"
                    stroke="#D6D6D6"
                    stroke-width="1.5"
                  />
                </svg>
              </div>
              <div className="h-2.5 flex-1 relative leading-[150%] inline-block">
                Bluearea, Islamabad
              </div>
            </div>
            <div className="w-[150px] flex flex-row items-center justify-start gap-2">
              <div className="h-6 w-6 relative">
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.97 19.0519C21.97 19.4119 21.89 19.7819 21.72 20.1419C21.55 20.5019 21.33 20.8419 21.04 21.1619C20.55 21.7019 20.01 22.0919 19.4 22.3419C18.8 22.5919 18.15 22.7219 17.45 22.7219C16.43 22.7219 15.34 22.4819 14.19 21.9919C13.04 21.5019 11.89 20.8419 10.75 20.0119C9.6 19.1719 8.51 18.2419 7.47 17.2119C6.44 16.1719 5.51 15.0819 4.68 13.9419C3.86 12.8019 3.2 11.6619 2.72 10.5319C2.24 9.39189 2 8.30189 2 7.26189C2 6.58189 2.12 5.93189 2.36 5.33189C2.6 4.72189 2.98 4.16189 3.51 3.66189C4.15 3.03189 4.85 2.72189 5.59 2.72189C5.87 2.72189 6.15 2.78189 6.4 2.90189C6.66 3.02189 6.89 3.20189 7.07 3.46189L9.39 6.73189C9.57 6.98189 9.7 7.21189 9.79 7.43189C9.88 7.64189 9.93 7.85189 9.93 8.04189C9.93 8.28189 9.86 8.52189 9.72 8.75189C9.59 8.98189 9.4 9.22189 9.16 9.46189L8.4 10.2519C8.29 10.3619 8.24 10.4919 8.24 10.6519C8.24 10.7319 8.25 10.8019 8.27 10.8819C8.3 10.9619 8.33 11.0219 8.35 11.0819C8.53 11.4119 8.84 11.8419 9.28 12.3619C9.73 12.8819 10.21 13.4119 10.73 13.9419C11.27 14.4719 11.79 14.9619 12.32 15.4119C12.84 15.8519 13.27 16.1519 13.61 16.3319C13.66 16.3519 13.72 16.3819 13.79 16.4119C13.87 16.4419 13.95 16.4519 14.04 16.4519C14.21 16.4519 14.34 16.3919 14.45 16.2819L15.21 15.5319C15.46 15.2819 15.7 15.0919 15.93 14.9719C16.16 14.8319 16.39 14.7619 16.64 14.7619C16.83 14.7619 17.03 14.8019 17.25 14.8919C17.47 14.9819 17.7 15.1119 17.95 15.2819L21.26 17.6319C21.52 17.8119 21.7 18.0219 21.81 18.2719C21.91 18.5219 21.97 18.7719 21.97 19.0519Z"
                    stroke="#D6D6D6"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                  />
                </svg>
              </div>
              <div className="h-2.5 flex-1 relative leading-[150%] inline-block">
                0459-232525
              </div>
            </div>
            <div className="flex flex-row items-center justify-start gap-2">
              <div className="h-6 w-6 relative">
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 21.2219H7C4 21.2219 2 19.7219 2 16.2219V9.22189C2 5.72189 4 4.22189 7 4.22189H17C20 4.22189 22 5.72189 22 9.22189V16.2219C22 19.7219 20 21.2219 17 21.2219Z"
                    stroke="#D6D6D6"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17 9.72189L13.87 12.2219C12.84 13.0419 11.15 13.0419 10.12 12.2219L7 9.72189"
                    stroke="#D6D6D6"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="h-2.5 relative leading-[150%] inline-block">
                chaindrive@gmail.com
              </div>
            </div>
          </div>
        </div>
        <div className="w-96 flex flex-col items-start justify-start pt-[7px] pb-0 pl-0 pr-[17px] box-border max-w-full">
          <div className="self-stretch flex flex-row items-start justify-between gap-5 mq450:flex-wrap">
            <div className="flex flex-col items-start justify-start gap-[19px]">
              <div className="relative leading-[150%] font-medium inline-block min-w-[85px]">
                Resources
              </div>
              <div className="flex flex-col items-start justify-start gap-[8.7px] text-sm text-lightgray">
                <div className="relative leading-[150%]">Download</div>
                <div className="relative leading-[150%] inline-block min-w-[84px]">
                  Help Centre
                </div>
                <div className="h-2.5 relative leading-[150%] inline-block shrink-0">
                  Guides
                </div>
                <div className="h-2.5 relative leading-[150%] inline-block shrink-0">
                  Developer
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-[19px]">
              <div className="relative leading-[150%] font-medium inline-block min-w-[126px]">
                About Rentcars
              </div>
              <div className="flex flex-row items-start justify-start py-0 px-[9px] text-sm text-lightgray">
                <div className="flex flex-col items-start justify-start gap-[5px]">
                  <div className="relative leading-[150%]">Why choose us</div>
                  <div className="h-2.5 relative leading-[150%] inline-block shrink-0 min-w-[66px]">
                    Our Story
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start pt-[7px] px-0 pb-0">
          <div className="flex flex-col items-start justify-start gap-[19px]">
            <div className="relative leading-[150%] font-medium inline-block min-w-[76px]">
              Follow Us
            </div>
            <div className="flex flex-row items-start justify-start gap-4">
              <div className="h-6 w-6 relative">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 9.3V12.2H16.6C16.8 12.2 16.9 12.4 16.9 12.6L16.5 14.5C16.5 14.6 16.3 14.7 16.2 14.7H14V22H11V14.8H9.3C9.1 14.8 9 14.7 9 14.5V12.6C9 12.4 9.1 12.3 9.3 12.3H11V9C11 7.3 12.3 6 14 6H16.7C16.9 6 17 6.1 17 6.3V8.7C17 8.9 16.9 9 16.7 9H14.3C14.1 9 14 9.1 14 9.3Z"
                    stroke="#D6D6D6"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                  />
                  <path
                    d="M15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H15C20 2 22 4 22 9V15C22 20 20 22 15 22Z"
                    stroke="#D6D6D6"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="h-6 w-6 relative">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                    stroke="#D6D6D6"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
                    stroke="#D6D6D6"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17.6361 7H17.6477"
                    stroke="#D6D6D6"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="h-6 w-6 relative">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 20H7C4 20 2 18 2 15V9C2 6 4 4 7 4H17C20 4 22 6 22 9V15C22 18 20 20 17 20Z"
                    stroke="#D6D6D6"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11.4 9.5L13.9 11C14.8 11.6 14.8 12.5 13.9 13.1L11.4 14.6C10.4 15.2 9.60001 14.7 9.60001 13.6V10.6C9.60001 9.3 10.4 8.9 11.4 9.5Z"
                    stroke="#D6D6D6"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="self-stretch flex flex-col items-start justify-start gap-8 mq725:gap-4">
        <div className="self-stretch h-px relative border-dimgray-200 border-t-[1px] border-solid box-border" />
        <div className="relative leading-[150%]">
          Copyright 2024 ・ ChainDrive, All Rights Reserved
        </div>
      </div>
    </div>
  );
};

export default Footer;
