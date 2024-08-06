// pages/bank.js

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Bank = () => {
  const [banks, setBanks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { os } = router.query;

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const apiUrl =
          os === 'ios'
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

    if (os) {
      fetchBanks();
    }
  }, [os]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBanks = banks.filter((bank) =>
    bank.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.bankName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="container mx-auto mt-8 p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8 mb-8 p-4">
      <Head>
        <title>Chọn Ngân Hàng</title>
      </Head>
      <h1 className="text-2xl font-bold mb-4">Chọn Ngân Hàng</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm ngân hàng..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
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
    </div>
  );
};

export default Bank;
