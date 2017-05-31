var FIRST_POLL_DATA;
if (!FIRST_POLL_DATA) {
    FIRST_POLL_DATA = {
        'first1': {
            inputName: 'gender',
            nextPage: 'first2',
            validator: [
                {
                    type: 'notnull',
                    message: '성별을 선택해주세요.'
                }
            ]
        },
        'first2': {
            inputName: 'birthday',
            nextPage: 'first3',
            validator: [
                {
                    type: 'notnull',
                    message: '생년월일을 선택해주세요.'
                }
            ]
        },
        'first3': {
            inputName: 'addr',
            nextPage: 'first4',
            validator: [
                {
                    type: 'notnull',
                    message: '거주지역을 선택해주세요.'
                }
            ]
        },
        'first4': {
            inputName: 'job',
            nextPage: 'first5',
            skipPage: 'first6',
            skipRule: ['HOMEMAKER', 'STUDENT', 'UNEMPLOYED'],
            validator: [
                {
                    type: 'notnull',
                    message: '직업을 선택해주세요.'
                }
            ],
            etcRule: ['ETC'],
            etcInputName: 'job_etc',
            etcValidator: [
                {
                    type: 'notnull',
                    message: '기타를 입력해 주세요.'
                }
            ]
        },
        'first5': {
            inputName: 'industry',
            nextPage: 'first6',
            validator: [
                {
                    type: 'notnull',
                    message: '근무하고 계신 직장의 업종을 선택해주세요.'
                }
            ],
            etcRule: ['ETC'],
            etcInputName: 'industry_etc',
            etcValidator: [
                {
                    type: 'notnull',
                    message: '기타를 입력해 주세요.'
                }
            ]
        },
        'first6': {
            inputName: 'edue',
            nextPage: 'first7',
            validator: [
                {
                    type: 'notnull',
                    message: '최종학력을 선택해주세요.'
                }
            ]
        },
        'first7': {
            inputName: 'marriage',
            nextPage: 'first8',
            skipPage: 'first9',
            skipRule: ['SINGLES'],
            validator: [
                {
                    type: 'notnull',
                    message: '결혼여부를 선택해주세요.'
                }
            ]
        },
        'first8': {
            multiInput: false,
            inputName: 'children_cnt',
            nextPage: 'first8-1',
            skipPage: 'first9',
            skipRule: ['0'],
            validator: [
                {
                    type: 'notnull',
                    message: '자녀가 몇명인지 선택해주세요.'
                }
            ],
            etcRule: ['6'],
            etcInputName: 'children_cnt_etc',
            etcValidator: [
                {
                    type: 'notnull',
                    message: '기타를 숫자로 입력해 주세요.'
                },
                {
                    type: 'condition',
                    condition: 'parseInt(inputValue) < 20',
                    message: '자녀는 최대 19명 까지 입력가능합니다.'
                }
            ],
            createNextPage: 'createChildren'
        },
        'first8-1': {
            multiInput: true,
            inputName: ['children_cnt_detail_year', 'children_cnt_detail_gender', 'children_cnt_detail_school'],
            nextPage: 'first9',
            validator: [
                {'children_cnt_detail_year': [
                    {
                        type: 'notnull',
                        message: '출생년도를 선택해주세요.'
                    }
                ]},
                {'children_cnt_detail_gender': [
                    {
                        type: 'notnull',
                        message: '성별을 선택해주세요.'
                    }
                ]},
                {'children_cnt_detail_school': [
                    {
                        type: 'notnull',
                        message: '교급을 선택해주세요.'
                    }
                ]}
            ],
            arrayInput: true,
            arrayDataName: 'first_children_data',
            arrayInputName: '자녀'
        },
        'first9': {
            inputName: 'single_cnt',
            nextPage: 'first10',
            validator: [
                {
                    type: 'notnull',
                    message: '귀하와 같이 거주하고 있는 사람(가족, 친척, 친구, 동료 등 포함)이 몇명인지 선택해주세요.'
                }
            ],
            etcRule: ['6'],
            etcInputName: 'single_cnt_etc',
            etcValidator: [
                {
                    type: 'notnull',
                    message: '인원수를 숫자로 입력해주세요.'
                }
            ]
        },
        'first10': {
            inputName: 'multicultural_yn',
            nextPage: 'first11',
            validator: [
                {
                    type: 'notnull',
                    message: '다문화가정 여부를 선택해주세요.'
                }
            ]
        },
        'first11': {
            inputName: 'house',
            nextPage: 'first12',
            validator: [
                {
                    type: 'notnull',
                    message: '주택유형을 선택해주세요'
                }
            ]
        },
        'first12': {
            inputName: 'house_type',
            nextPage: 'first13',
            validator: [
                {
                    type: 'notnull',
                    message: '주택의 거주 형태를 선택해주세요.'
                }
            ]
        },
        'first13': {
            inputName: 'house_money',
            nextPage: 'first14',
            validator: [
                {
                    type: 'notnull',
                    message: '가구 월 평균 소득을 선택해주세요.'
                }
            ]
        },
        'first14': {
            inputName: 'my_money',
            nextPage: 'first15',
            validator: [
                {
                    type: 'notnull',
                    message: '개인 월 평균 소득을 선택해주세요.'
                }
            ]
        },
        'first15': {
            inputName: 'financial',
            bitCalc: true,
            nextPage: 'first16',
            validator: [
                {
                    type: 'notnull',
                    message: '재테크 방법을 선택해주세요.'
                }
            ],
            etcRule: ['1024'],
            etcInputName: 'financial_etc',
            etcValidator: [
                {
                    type: 'notnull',
                    message: '기타를 입력해 주세요.'
                }
            ]
        },
        'first16': {
            inputName: 'religion',
            nextPage: 'first17',
            validator: [
                {
                    type: 'notnull',
                    message: '종교를 선택해주세요.'
                }
            ],
            etcRule: ['ETC'],
            etcInputName: 'religion_etc',
            etcValidator: [
                {
                    type: 'notnull',
                    message: '기타를 입력해 주세요.'
                }
            ]

        },
        'first17': {
            inputName: 'driverlicense',
            nextPage: 'first17-1',
            skipPage: 'first18',
            skipRule: ['DRIVING_N', 'N'],
            validator: [
                {
                    type: 'notnull',
                    message: '자동차 운전여부를 선택해주세요.'
                }
            ]
        },
        'first17-1': {
            inputName: 'drivingcareer',
            nextPage: 'first17-2',
            validator: [
                {
                    type: 'notnull',
                    message: '운전경력을 선택해주세요.'
                }
            ]
        },
        'first17-2': {
            inputName: 'drivingavg',
            nextPage: 'first17-3',
            validator: [
                {
                    type: 'notnull',
                    message: '월 평균 운전횟수를 선택해주세요.'
                }
            ]
        },
        'first17-3': {
            inputName: 'carhave',
            nextPage: 'first18',
            validator: [
                {
                    type: 'notnull',
                    message: '차량의 대수를 선택해주세요.'
                }
            ]
        },
        'first18': {
            inputName: 'smartphone_use',
            nextPage: 'first18-1',
            skipPage: 'first19',
            skipRule: ['N'],
            validator: [
                {
                    type: 'notnull',
                    message: '휴대폰(스마트폰) 사용여부를 선택해주세요.'
                }
            ]
        },
        'first18-1': {
            inputName: 'smartphone_cnt',
            nextPage: 'first18-2',
            validator: [
                {
                    type: 'notnull',
                    message: '휴대폰(스마트폰) 보유개수를 선택해주세요.'
                }
            ],
            createNextPage: 'createCellPhone'
        },
        'first18-2': {
            multiInput: true,
            inputName: ['smartphone_detail_maker', 'smartphone_detail_type', 'smartphone_detail_app'],
            nextPage: 'first19',
            validator: [
                {'smartphone_detail_maker': [
                    {
                        type: 'notnull',
                        message: '제조사를 선택해주세요.'
                    }
                ]},
                {'smartphone_detail_type': [
                    {
                        type: 'notnull',
                        message: '통신사를 선택해주세요.'
                    }
                ]},
                {'smartphone_detail_app': [
                    {
                        type: 'notnull',
                        message: '유료앱 이용여부를 선택해주세요.'
                    }
                ]}
            ],
            arrayInput: true,            
            arrayDataName: 'first_smartphone_data',               
            arrayInputName: '휴대폰'
        },
        'first19': {
            inputName: 'sns_site',
            bitCalc: true,
            nextPage: 'first-complete',
            validator: [
                {
                    type: 'notnull',
                    message: '사용하는 SNS(메신져 포함)를 선택해주세요.'
                }
            ],
            etcRule: ['32768'],
            etcInputName: 'sns_site_etc',
            etcValidator: [
                {
                    type: 'notnull',
                    message: '기타를 입력해 주세요.'
                }
            ]
        }
    };
};