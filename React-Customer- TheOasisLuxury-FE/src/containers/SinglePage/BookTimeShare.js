import React, { useContext, useEffect, useState } from 'react';
import { Input, Button, DatePicker, Select, InputNumber, Row, Col, Typography, message } from 'antd';
import Container from 'components/UI/Container/Container';
import Card from 'components/UI/Card/Card';
import { AuthContext } from 'context/AuthProvider.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { VillaContext } from 'context/VillaContext';
import Policy from './Policy/Policy';
import { FormActionArea } from './Reservation/Reservation.style';
import BackButton from 'components/UI/ButtonBACK';
import Breadcrumbs from 'components/UI/Breadcrumbs';
import { BOOK_TIME_SHARE, HOME_PAGE, LISTING_POSTS_PAGE, LOGIN_PAGE } from 'settings/constant';



const { Title, Text } = Typography;
const formatter = value => `${value} VND`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');


// const { Option } = Select;

const BookingTimeShareForm = ({ value }) => {
    const { user, getUserInfo } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState({});
    const { villaDetails } = useContext(VillaContext);
    const navigate = useNavigate(); // Initialize use
    const idVilla = villaDetails && Object.keys(villaDetails)[0];
    const details = villaDetails[idVilla];
    console.log('details', details); 



    // Form state
    const location = useLocation();
    const reservationState = location.state; // This contains startDate, endDate, totalWeeks, totalPrice
    console.log('reservationState', reservationState);

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        startDate: null,
        endDate: null, // Added for capturing end date
        passengers: 1,
        destination: 'destination1',
        totalWeeks: reservationState?.totalWeeks,
        additionalRequests: '',
        description: '',
        total_week: reservationState?.totalWeeks, // Added for order description
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userDetails = await getUserInfo(user.user_id);
            console.log('userDetails', userDetails)
            if (userDetails) {
                setUserInfo(userDetails);
                // Update form state with user details
                setForm({
                    ...form,
                    fullName: userDetails.user.full_name || '',
                    email: userDetails.user.email || '',
                    phoneNumber: userDetails.user.phone_number || '',
                });
            }
        };

        if (user.user_id) {
            fetchUserInfo();
        }
    }, [user.user_id, getUserInfo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prepare the data to be sent in the POST request
        const postData = {
            user_id: user.user_id,
            villa_id: idVilla,
            // villa_time_share_id: "65e40adedee99599d33ee1f7",
            price: reservationState?.totalPrice,
            start_date: reservationState?.startDate,
            end_date: reservationState?.endDate, // Format the end date
            description: form.description, // Description from form
            order_name: details.villa_name,
            total_week: form.total_week,
        };
        try {
            const token = localStorage.getItem('token'); // Assuming you're using token-based authentication
            const response = await fetch('http://localhost:5000/api/v1/users/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    // Include other headers as necessary, like authorization tokens
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                document.getElementById("bottom").scrollIntoView({ behavior: "smooth" });
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const orderId = result.result.order; // result là phản hồi từ API
            console.log('orderId của Book',orderId);
            // const contractId = result.result.contract; // result là phản hồi từ API
            const villaTimeshareId = result.result.villa_time_share; // result là phản hồi từ API
            navigate(`/orders/${orderId}/contract`, { state: { orderId, villaTimeshareId, idVilla, reservationDetails: reservationState } });
        } catch (error) {
            message.error('Vui lòng Đăng nhập / Đăng ký để tiếp tục');
            navigate({LOGIN_PAGE}); 
            document.getElementById("bottom").scrollIntoView({ behavior: "smooth" });
            console.error('Error during the fetch operation:', error);
        }
    };

    const breadcrumbs = [
        { title: 'Home', href: HOME_PAGE },
        { title: 'Villa', href: LISTING_POSTS_PAGE },
        { title: 'Order', href: BOOK_TIME_SHARE },
        // Thêm các breadcrumb khác nếu cần
    ];


    return (
        <div className='mt-10'>
            <Container>
                <Row gutter={30} id="tourOverviewSection" style={{ marginTop: 30 }}>
                    <Col span={24} className='flex'>
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                        <BackButton />
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row gutter={30} id="tourOverviewSection" style={{ marginTop: 30 }}>
                    <Col span={24}>
                        <div className="tour-overview-container">
                            <Card className="tour-overview-card">
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <div className="tour-image-container">
                                            <img src={details.url_image[0]} alt="Tour Image" className="tour-image" />
                                        </div>
                                    </Col>
                                    <Col span={16}>
                                        <div className="tour-details text-lg">
                                            <Title level={3} >{details.villa_name}</Title>
                                            <p><strong>Địa chỉ: </strong> {details.address}</p>
                                            <p><strong>Thuộc dự án: </strong> project name</p>
                                            <p><strong>Thuộc phân khu: </strong> subdivision name</p>
                                            <p><strong>Diện  tích: </strong> {details.area}</p>
                                            <p><strong>Tổng số phòng: </strong> 10 (1 Phòng khách, 5 phòng ngủ, 4 wc)</p>
                                            <p><strong>View:  </strong> View hướng biển</p>
                                            <p><strong>Tiện ích bao gồm: </strong> hồ bơi, wifi,...</p>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    </Col>
                </Row>

                <Row gutter={30} id="reviewSection" style={{ marginTop: 30 }}>
                    <Col xl={16}>
                        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-lg" onSubmit={handleSubmit}>
                            {/* Header section */}
                            <div className="mb-4">
                                <h2 className="text-xl font-bold">BOOKING TIME SHARE VILLAS FORM</h2>
                            </div>

                            {/* Contact Information with Input fields */}
                            <div className="mb-4">
                                <label htmlFor="fullName"> <strong>Họ và tên*</strong> </label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email"><strong>Email*</strong></label>
                                <Input
                                    id="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="phoneNumber"><strong>Số điện thoại*</strong></label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={form.phoneNumber}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className='mb-4 '>
                                <p><strong>Ngày bắt đầu: </strong> {reservationState?.startDate || 'Default Start Date'} - <strong>Ngày kết thúc: </strong> {reservationState?.endDate || 'Default End Date'}</p>
                                {/* <p><strong>Ngày kết thúc: </strong> {reservationState?.endDate || 'Default End Date'}</p> */}
                            </div>

                            {/* Date Picker
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="datePicker">
                                Ngày sinh*
                            </label>
                            <DatePicker />
                        </div> */}

                            {/* Number of total_week */}
                            <div className="mb-4">
                                <p><strong>Tổng thời gian mua:  </strong> {form.total_week} tuần</p>
                            </div>

                            {/* Additional Requests */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="additionalRequests">
                                    Ghi chú thêm
                                </label>
                                <Input.TextArea rows={4} id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mô tả cho đơn hàng" />
                            </div>
                            <div className='flex text-xl font-bold text-center text-cyan-700'>
                                <p className='mr-4'>Tổng tiền: </p> <p>{formatter(reservationState?.totalPrice || 'Default Price')}</p>
                            </div>

                            {/* Submit Button */}
                            {/* <div className="items-center justify-betwee w-full"> */}
                            <FormActionArea id="bottom">
                                <Button type="primary" htmlType="submit" className='w-full'>
                                    ĐẶT NGAY
                                </Button>
                            </FormActionArea>

                            {/* </div> */}
                        </form>
                    </Col>
                    {/* Tổng quan và tổng tiền*/}
                    <Col xl={8}>
                        <Card className="bg-white shadow-md rounded">
                            <Policy />
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default BookingTimeShareForm;