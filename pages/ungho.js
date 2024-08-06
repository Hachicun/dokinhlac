// pages/ungho.js

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useRouter } from 'next/router';

const UngHo = () => {
  const [copied, setCopied] = useState(false);
  const [banks, setBanks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const os = /android/i.test(userAgent) ? 'android' : /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream ? 'ios' : null;
        
        if (!os) {
          alert('Thiết bị của bạn không được hỗ trợ');
          return;
        }

        const apiUrl = os === 'ios'
          ? 'https://api.vietqr.io/v2/ios-app-deeplinks'
          : 'https://api.vietqr.io/v2/android-app-deeplinks';

        const response = await fetch(apiUrl);
        const data = await response.json();
        setBanks(data.apps);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching bank data:', error);
        setIsLoading(false);
      }
    };

    fetchBanks();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBanks = banks.filter((bank) =>
    bank.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.bankName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto mt-8 mb-8 p-4">
      <Head>
        <title>Ủng Hộ</title>
      </Head>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4 border-b pb-4">
          <h2 className="text-xl font-medium text-gray-900">Ủng hộ</h2>
        </div>
        <div className="space-y-4">
          <p className="text-base leading-relaxed text-gray-500">
            Việc vận hành, duy trì, và phát triển một phần mềm cho nhiều học viên Lục Khí đòi hỏi nhiều chi phí, thời gian công sức.
          </p>
          <p className="text-base leading-relaxed text-gray-500">
            Lục Khí mong được sự đồng hành và ủng hộ của bạn để có thể duy trì, và phát triển nhiều tính năng để hỗ trợ bạn nhiều hơn trong việc chẩn đoán và điều trị bệnh.
          </p>

          <p className="text-base leading-relaxed text-gray-500"><strong>Mọi đóng góp xin gửi về:</strong></p>
          <div className="space-y-2">
            <p className="text-base leading-relaxed text-gray-500"><strong>Ngân hàng:</strong> <em><u>Viettinbank</u></em></p>
            <div className="flex items-center space-x-2">
              <p className="text-base leading-relaxed text-gray-500"><strong>Số tài khoản:</strong></p>
              <CopyToClipboard text="105001266706" onCopy={() => setCopied(true)}>
                <button className="text-blue-600 underline"><strong>105001266706</strong></button>
              </CopyToClipboard>
              {copied && <span className="text-green-500">Đã sao chép</span>}
            </div>
            <p className="text-base leading-relaxed text-gray-500">
              <em>( hoặc nhập vào LUCKHI cũng ra người nhận)</em><br />
              <strong>Chủ tài khoản:</strong> <u>Vũ Đức Đại</u><br />
              <strong>Nội dung chuyển khoản:</strong> Tên+SĐT người đóng góp+ <em>unghophanmem</em><br />
              <strong>Chi nhánh:</strong> <u>Vietinbank chi nhánh Đống Đa</u>
            </p>
          </div>
          <p className="text-base leading-relaxed text-gray-500"><strong>Hoặc quét mã QR:</strong></p>
          <div className="flex justify-center"><Image src="/qr-code.jpg" alt="QR Code" width={200} height={200} /></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Chọn Ngân Hàng Của Bạn</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm ngân hàng..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {filteredBanks.map((bank) => (
              <a
                key={bank.appId}
                href={bank.deeplink}
                className="flex flex-col items-center bg-white p-2 rounded-lg shadow hover:bg-gray-100"
              >
                <Image src={bank.appLogo} alt={bank.appName} width={50} height={50} className="mb-2" />
                <h2 className="text-sm font-medium text-gray-900 text-center">{bank.appName}</h2>
                <p className="text-xs text-gray-600 text-center">{bank.bankName}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UngHo;
