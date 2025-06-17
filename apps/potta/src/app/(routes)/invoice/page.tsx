'use client';
import InvoiceTableComponents from './components/table';

const Invoice = () => {
  return (
    <div className=" px-14">
      {/* <CustomInput />
      <CustomSelect
        options={options}
        value={selectedValue}
        onChange={setSelectedValue}
        placeholder="Choose an option"
      /> */}
      <div className="">
        <InvoiceTableComponents />
      </div>
    </div>
  );
};

export default Invoice;
