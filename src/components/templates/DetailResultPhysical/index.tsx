/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */

import Icon from 'components/atoms/Icon';
import Loading from 'components/atoms/Loading';
import Typography from 'components/atoms/Typography';
import ListCategoriesResult from 'components/molecules/ListCategoriesResult';
import React, { useEffect, useState, useLayoutEffect, useMemo } from 'react';
import { useMutation } from 'react-query';
import { getExamDiseaseReport, getResultDetailCustomer, postPrintAllreport, postPrintAnesthesia, postPrintBreathtest, postPrintEcgs, postPrintEndoscopics, postPrintErms, postPrintLabtest, postPrintPrescriptions, postPrintServicepoint, postPrintSupersonics, postPrintXrays } from 'services/api/customerInfo';
import { getCategoriesCustomer } from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import mapModifiers, { downloadBlobPDF, previewBlobPDFOpenLink } from 'utils/functions';

import RenderExaminationResult, { ResultType } from '../RenderExaminationResult';

interface DetailResultPhysicalProps {
  id: string
}

const DetailResultPhysical: React.FC<DetailResultPhysicalProps> = ({ id }) => {
  const dispatch = useAppDispatch();

  const customerInfo = useAppSelector((state) => state.infosCustomer.respCustomerInfo);
  const listCategoriesCustomer = useAppSelector((state) => state.infosCustomer.resultsCategories);
  const resultsCategorieLoading = useAppSelector((state) => state.infosCustomer.resultsCategorieLoading);

  const [categoriesLoading, setCategoriesLoading] = useState(resultsCategorieLoading);
  const [listCategories, setListCategories] = useState(listCategoriesCustomer);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [dataRender, setDataRender] = useState<any>();
  const [dataPrint, setDataPrint] = useState<any>();
  const [isPrintOption, setIsPrintOption] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPrint, setIsPrint] = useState(false);
  const [toggle, setToggle] = useState(!listCategories?.data?.length || false);

  const { mutate: postResultExamCustomerById } = useMutation(
    'post-footer-form',
    (data: any) => getResultDetailCustomer(data),
    {
      onSuccess: (data) => {
        setIsSuccess(true)
        if (data?.status) {
          setError('');
          setDataRender(data?.data);
        } else {
          setError(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  // In phieu ket qua Xet Nghiem
  const { mutate: postPrintResult } = useMutation(
    'post-footer-form',
    (data: any) => {
      const { type, ...prevData } = data;
      switch (type) {
        case 'PCD': return postPrintServicepoint({ master_id: prevData?.master_id });
        case 'DT': return postPrintEcgs(prevData);
        case 'XQ': return postPrintXrays(prevData);
        case 'SA': return postPrintSupersonics(prevData);
        case 'NS': return postPrintEndoscopics(prevData);
        case 'XNHT': return postPrintBreathtest(prevData);
        case 'XN': return postPrintLabtest(prevData);
        case 'TDV': return postPrintPrescriptions(prevData);
        case 'EMR': return postPrintErms(prevData);
        // case 'GPB': return;
        // case 'XNSHPT': return;
        default: return postPrintAnesthesia(prevData);
      }
    },
    {
      onSuccess: (data) => {
        if (data?.status) {
          setIsPrintOption(false);
          downloadBlobPDF(data?.data, `${customerInfo?.data?.customer?.customer_fullname}`);
        } else {
          setError(data?.message);
          setIsPrintOption(false);
        }
      },
      onError: (error) => {
        setIsPrintOption(false);
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: postPrintAll } = useMutation(
    'post-footer-form',
    (data: any) => postPrintAllreport(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setIsPrint(false);
          downloadBlobPDF(data?.data, `${customerInfo?.data?.customer?.customer_fullname}`);
        } else {
          setError(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: getExamDiseaseReportByMasterId } = useMutation(
    'post-footer-form',
    (data: any) => getExamDiseaseReport(data),
    {
      onSuccess: (data) => {
        setIsSuccess(true)
        if (data?.status) {
          setDataRender(data?.data);
        } else {
          setError(data?.message);
          setDataRender(undefined);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const handlePrintResult = async (masterId: any) => {
    const body = {
      customer: {
        ...customerInfo?.data?.customer,
      },
      master_id: masterId,
    };
    setIsPrint(true);
    await postPrintAll(body);
  };

  const handlePrintCategory = async () => {
    const bodyPublic = {
      type: dataPrint?.service_group_type,
      master_id: dataPrint?.master_id,
      service_group_type: dataPrint?.service_group_type,
      id: dataPrint?.id,
    }
    setIsPrintOption(true)
    postPrintResult(bodyPublic)
  };

  const handleSetResult = async (body: any) => {
    const request = {
      ...body,
      customer: {
        ...customerInfo.data.customer
      }
    }
    setError('');
    await postResultExamCustomerById(request);
  };

  useEffect(() => {
    setListCategories(listCategoriesCustomer);
    setToggle(!listCategoriesCustomer?.data?.length)
  }, [listCategoriesCustomer?.data])

  useEffect(() => {
    setCategoriesLoading(resultsCategorieLoading);
  }, [resultsCategorieLoading])

  useLayoutEffect(() => {
    if (!listCategories?.data && id) {
      dispatch(getCategoriesCustomer(id));
    }
  }, [])

  const handleGetReportExaminationDisease = async (body: any) => {
    await getExamDiseaseReportByMasterId(body);
  }

  const memoryCategories = useMemo(() => {
    return (
      <div className="o-categories_customer_left">
        <ListCategoriesResult
          response={listCategories?.data}
          handleGetBody={(body: any, type: ResultType) => {
            if (type === 'overview') {
              handleGetReportExaminationDisease(body)
            } else {
              handleSetResult(body);
            }
            setIsSuccess(false);
          }}
          handleClick={() => setDataRender(undefined as any)}
          handleType={(resp: string) => setType(resp)}
          handleTitle={(val: string) => setTitle(val)}
          handleRespDataToPrint={(data: any) => {
            setDataPrint(data);
          }}
          handlePrintResult={handlePrintResult}
          isPintAll={isPrint}
        />
      </div>
    )
  }, [listCategories.data, isPrint])

  return (
    listCategories?.data ?
      <div className={`${mapModifiers("o-categories_customer", toggle && 'close')} t-result_physical`}>
        {memoryCategories}
        <div className="o-categories_customer_right">
          {
            window.innerWidth < 1280 &&
            <div className="o-categories_customer_right_toggle">
              <Icon iconName={!toggle ? "menu_fold" : "menu_unfold"} onClick={() => setToggle(!toggle)} />
            </div>
          }
          {title.trim() ? (
            <div className="o-categories_customer_right_result">
              <RenderExaminationResult
                type={type as any}
                data={dataRender}
                title={title}
                masterId={(listCategories?.data || [])[0]?.master_id}
                registerDate={(listCategories?.data || [])[0]?.register_date}
                error={error}
                isPrintOption={isPrintOption}
                handlePrint={handlePrintCategory}
                isRenderDone={isSuccess}
              />
            </div>
          ) : null}

        </div>
      </div>
      : categoriesLoading ? <div className={mapModifiers('o-categories_customer_loading',)} >
        <Loading />
      </div>
        : <div className={mapModifiers('o-categories_customer_loading',)} >
          <Typography content="Không tìm thấy thông tin lịch sử khám" />
        </div>

  );
};

DetailResultPhysical.defaultProps = {
};

export default DetailResultPhysical;
