import { ComponentPropsWithoutRef } from 'react'

type SvgProps = ComponentPropsWithoutRef<'svg'>

type LoadingIconProps = {
  height?: number
  width?: number
  strokeWidth?: number
  color?: string
  className?: string
} & SvgProps

const LoadingIcon: React.FC<LoadingIconProps> = ({
  width = 34,
  height = 24,
  color = '#001B04',
  strokeWidth = 1,
  className,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M13.7282 6.27126C12.0491 5.79256 10.3331 6.09189 8.96346 6.95635C8.72993 7.10374 8.42115 7.03391 8.27376 6.80039C8.12638 6.56686 8.19621 6.25808 8.42973 6.11069C10.0298 5.10084 12.0384 4.74965 14.0023 5.30958C16.8741 6.12833 18.7979 8.65046 18.9924 11.4655L18.9936 11.4827V11.5V13.7122L21.0603 11.5917C21.253 11.3939 21.5696 11.3898 21.7673 11.5826C21.9651 11.7753 21.9692 12.0918 21.7764 12.2896L18.8706 15.2713L18.5262 15.6246L18.1684 15.285L15.0262 12.3036C14.8259 12.1135 14.8176 11.7971 15.0077 11.5967C15.1978 11.3964 15.5142 11.3881 15.7145 11.5782L17.9936 13.7407V11.5176C17.8207 9.1162 16.1763 6.96924 13.7282 6.27126ZM3.13458 13.151L5.21512 11.0162V12H5.2151L5.21514 12.0044C5.24151 14.9827 7.2105 17.7133 10.2213 18.5717C12.1852 19.1316 14.1938 18.7804 15.7939 17.7706C16.0274 17.6232 16.0972 17.3144 15.9498 17.0809C15.8024 16.8473 15.4937 16.7775 15.2601 16.9249C13.8904 17.7894 12.1745 18.0887 10.4954 17.61C7.92336 16.8767 6.23861 14.5439 6.21512 11.9977V11.0151L8.4803 13.1645C8.68062 13.3545 8.9971 13.3462 9.18717 13.1459C9.37724 12.9456 9.36893 12.6291 9.16862 12.439L6.0265 9.45765L5.6686 9.11806L5.32427 9.47139L2.41843 12.453C2.2257 12.6508 2.22977 12.9674 2.42753 13.1601C2.62529 13.3528 2.94185 13.3487 3.13458 13.151Z"
      fill={color}
      strokeWidth={strokeWidth}
    />
  </svg>
)

export default LoadingIcon
