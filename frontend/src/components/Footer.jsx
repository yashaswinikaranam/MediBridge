import { assets } from "../assets/assets"

const Footer = () => {
  return (
    <div>
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
            {/*-------LEFT SECTION------------*/}
            <img className="mb-4 w-40" src={assets.name} alt="" />
            <p className="w-full md:w-2/3 text-gray-600 leading-6">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui placeat a, molestiae dolorem labore nam consequuntur recusandae optio perspiciatis, quas aliquam alias repellendus minus molestias beatae iste tempore sapiente vero.</p>
        </div>
        <div>
            <p className="text-xl font-medium mb-5">COMPANY</p>
            <ul className="flex flex-col gap-2 text-gray-600">
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
            {/*-------CENTER SECTION------------*/}
        </div>
        <div>
            {/*-------RIGHT SECTION------------*/}
            <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap-2 text-gray-600">
                <li>+0-000-000-000</li>
                <li>greatstackdev@gmail.com</li>
            </ul>
        </div>
    </div>
    <div>
        <hr />
        <p className="py-5 text-sm text-center">Copyright 2024 @ Greatstack.dev - All Right Reserved.</p>
    </div>
    </div>
  )
}

export default Footer