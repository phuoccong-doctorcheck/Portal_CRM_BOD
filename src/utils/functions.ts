

// Hàm mapModifiers giúp bạn tạo ra một chuỗi class name cho CSS bằng cách kết hợp một tên class
//   cơ bản với các modifier được chỉ định.Điều này rất hữu ích trong việc tạo các class name động 
//   cho các phần tử giao diện trong các ứng dụng web, đặc biệt là khi sử dụng các phương pháp CSS như BEM(Block Element Modifier).
 function mapModifiers(
    baseClassName: string,
    ...modifiers: (string | string[] | false | undefined)[]
  ): string {
    return modifiers
      .reduce<string[]>(
        (acc, m) => (!m ? acc : [...acc, ...(typeof m === "string" ? [m] : m)]),
        []
      )
      .map((m) => `-${m}`)
      .reduce<string>(
        (classNames, suffix) => `${classNames} ${baseClassName}${suffix}`,
        baseClassName
      );
  }
  export default mapModifiers;
  export const handleRenderGUID = () =>
    "00-0-4-1-000".replace(/[^-]/g, (s: any) =>
      (((Math.random() + ~~s) * 0x10000) >> s).toString(16).padStart(4, "0")
    );
    export const handleScrollCenter = (
      ref: React.RefObject<HTMLDivElement | HTMLUListElement | null>,
      classNameEleActive: string
    ) => {
      const eleScroll = ref.current;
      const eleActive = eleScroll && eleScroll.querySelector(classNameEleActive);
      if (!eleActive || !eleScroll) return;
      // get width element scroll
      const widthEleScroll = eleScroll.getBoundingClientRect().width;
      // get distance element scroll compared to y window
      const xEleScroll = eleScroll.getBoundingClientRect().x;
      // get width element active
      const widthEleActive = eleActive.getBoundingClientRect().width;
      // get distance element active compared to y window
      const xEleActive = eleActive.getBoundingClientRect().x;
      // get position sroll bar
      const positionScroll = eleScroll.scrollLeft;
      const scrollX =
        xEleActive -
        xEleScroll +
        widthEleActive / 2 +
        positionScroll -
        widthEleScroll / 2;
      eleScroll.scroll({
        left: scrollX,
        behavior: "smooth",
      });
    };