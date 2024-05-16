export function calculateDataset(origin_dataset) {
    // Extract the relevant values from origin_dataset
    const values = [
      origin_dataset.tieutruong_trai, origin_dataset.tam_trai, origin_dataset.tamtieu_trai, origin_dataset.tambao_trai, origin_dataset.daitruong_trai, origin_dataset.phe_trai,
      origin_dataset.tieutruong_phai, origin_dataset.tam_phai, origin_dataset.tamtieu_phai, origin_dataset.tambao_phai, origin_dataset.daitruong_phai, origin_dataset.phe_phai,
      origin_dataset.bangquang_trai, origin_dataset.than_trai, origin_dataset.dom_trai, origin_dataset.vi_trai, origin_dataset.can_trai, origin_dataset.ty_trai,
      origin_dataset.bangquang_phai, origin_dataset.than_phai, origin_dataset.dom_phai, origin_dataset.vi_phai, origin_dataset.can_phai, origin_dataset.ty_phai
    ].map(value => value / 10);
  
    // Calculate the required values
    const max_finger = Math.max(...values.slice(0, 12));
    const min_finger = Math.min(...values.slice(0, 12));
    const dental_finger = max_finger - min_finger;
    const average_minmax_finger = (max_finger + min_finger) / 2;
    const average_dental_finger = dental_finger / 6;
  
    const max_toe = Math.max(...values.slice(12, 24));
    const min_toe = Math.min(...values.slice(12, 24));
    const dental_toe = max_toe - min_toe;
    const average_minmax_toe = (max_toe + min_toe) / 2;
    const average_dental_toe = dental_toe / 6;
  
    // Define labels for fingers and toes
    const labels = ['Tiểu trường', 'Tâm', 'Tam tiêu', 'Tâm bào', 'Đại trường', 'Phế', 'Bàng quang', 'Thận', 'Đởm', 'Vị', 'Can', 'Tỳ'];
  
    // Create the data object
    const data = {};
    for (let i = 0; i < 6; i++) {
      const Detal_avarge_finger = (values[i] + values[i + 6]) / 2 - average_minmax_finger;
      const Percent_finger = (Detal_avarge_finger / average_dental_finger) * 100;
      data[labels[i]] = Percent_finger;
    }
  
    for (let i = 0; i < 6; i++) {
      const Detal_avarge_toe = (values[i + 12] + values[i + 18]) / 2 - average_minmax_toe;
      const Percent_toe = (Detal_avarge_toe / average_dental_toe) * 100;
      data[labels[i + 6]] = Percent_toe;
    }
  
    return data;
  }
  