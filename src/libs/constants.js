import { HomeIcon, CategoryIcon, BookIcon, UserIcon, IssuanceIcon, SuccessIcon, AlertIcon, ErrorIcon, InfoIcon } from "../components/icons/Icons";
import logo from '../assets/images/logo.svg'
import favicon from '../assets/images/favicon.svg'

export const images = {
    favicon, logo
}

export const adminSidebarLinks = [
    {
        id: 1,
        name: 'Dashboard',
        url: '/admin/dashboard',
        icon: HomeIcon,
    },
    {
        id: 2,
        name: 'Category',
        url: '/admin/category',
        icon: CategoryIcon,
    },
    {
        id: 3,
        name: 'Book',
        url: '/admin/book',
        icon: BookIcon,
    },
    {
        id: 4,
        name: 'User',
        url: '/admin/user',
        icon: UserIcon,
    },
    {
        id: 5,
        name: 'Issuance',
        url: '/admin/issuance',
        icon: IssuanceIcon,
    },
]

export const toastIcons = {
    success: {
        icon: SuccessIcon,
        color: 'green'
    },
    error: {
        icon: ErrorIcon,
        color: 'red'
    },
    info: {
        icon: InfoIcon,
        color: 'blue'
    },
    warning: {
        icon: AlertIcon,
        color: 'yellow'
    }

}

export const validationPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    mobile: /^[0-9]{10}$/,
    AZ: /[A-Z]/,
    az: /[a-z]/,
    number: /[0-9]/,
    anyChar: /[^A-Za-z0-9]/,
    alphabet: /^[a-zA-Z\s]*$/,
}

export const issuance = {
    status: {
        ISSUED: 'Issued',
        RETURNED: 'Returned',
    },
    type: {
        IN_HOUSE: 'In house',
        TAKE_AWAY: 'Take away',
    },
}

