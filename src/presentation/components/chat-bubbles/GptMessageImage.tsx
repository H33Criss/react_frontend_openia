interface Props {
  text: string;
  imageUrl: string;
  alt: string;
  onImageSelect?: (imageUrl: string) => void;
}

export const GptMessageImage = ({
  text,
  imageUrl,
  alt,
  onImageSelect,
}: Props) => {
  return (
    <div className="col-start-1 col-end-8 p-3 rounded-lg">
      <div className="flex flex-row items-start">
        <div className=" flex items-center justify-center h-10 w-10 rounded-full bg-green-600 flex-shrink-0 ">
          G
        </div>
        <div className=" relative  ml-3 text-sm bg-black bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl">
          <span className="italic">"{text}"</span>
          <img
            src={imageUrl}
            alt={alt}
            onClick={() => onImageSelect && onImageSelect(imageUrl)}
            className="mt-1 rounded-xl w-full h-96 object-cover"
          />
        </div>
      </div>
    </div>
  );
};
