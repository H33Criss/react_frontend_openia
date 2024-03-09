import { NavLink } from 'react-router-dom'

interface Props {
    to: string,
    icon: React.ReactNode,
    title: string,
    description: string,
}

export const SidebarMenuItem = ({ description, icon, title, to }: Props) => {
    return (
        <NavLink key={to}
            to={to}
            className={
                ({ isActive }) => isActive
                    ? 'flex justify-center items-center bg-gray-800 rounded-md p-2 transition-colors'
                    : 'flex justify-center items-center hover:bg-gray-800 rounded-md p-2 transition-colors'
            }
        >
            <i className={`${icon} text-2xl mr-4 text-indigo-400`} />
            <div className="flex flex-col flex-grow">
                <span className=" text-white text-lg font-semibold">
                    {title}
                </span>
                <span className=" text-white text-sm font-semibold">
                    {description}
                </span>
            </div>
        </NavLink>
    )
}
