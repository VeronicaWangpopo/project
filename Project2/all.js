
$(function () {
    /*
    *== json 格式 ==*
     SiteName: "大寮",
     County: "高雄市",
     AQI: "97",
     MajorPollutant: "臭氧",
     Status: "普通",
     SO2: "9.6",
     CO: "0.59",
     O3: "117",
     PM10: "114",
     PM2.5: "54",
     NO2: "24",
     WindSpeed: "3.5",
     WindDirec: "194",
     FPMI: "6",
     NOx: "25.79",
     NO: "1.57",
     PublishTime: "2016-10-14 15:00"
     */

    var url = "http://opendata.epa.gov.tw/ws/Data/REWIQA/", //空氣品質即時污染指標
        county = "新北市", //區域：高雄市
        order = "SiteName", //排序依照:城市
        format = "json", //資料格式
        filter = "?$filter=County%20eq%20'" + county + "'&$orderby=" + order + "&format=" + format, //篩選設定
        API = url + filter, //篩選後的資料url
        json = {}, //接資料用的陣列
        selector = $('select[name="districtName"]'), //下拉選單
        box = $('.detect-box-content'); //資料顯示區塊

    $.ajax({
        dataType: "jsonp",
        url: API,
        data: {
            "data": json
        },
        success: function (data) {
            console.log(API);
            //初始化下拉選單的選項
            for (var i in data) {
                selector.append('<option value="' + data[i].SiteName + '">' + data[i].SiteName + '</option>');
            }
            //預設顯示使用資料中第一筆
            DetectInfo(data[0]);

            //綁定下拉選單的選項來改變空污資訊
            selector.on('change', function () {
                var index = $(this)
                    .children('option:selected')
                    .index();
                DetectInfo(data[index-1]);
            })
        },
        error: function () {
            box
                .find('.title')
                .html('空氣品質細懸浮微粒指標資料異常，請稍候再試!');
        }
    });

    /*空污資訊*/
    function DetectInfo(airInfo) {
        var air = airInfo,
            sAQI = defineAQI(air.AQI), //定義AQI樣式
            sFPMI = defineFPMI(air['PM2.5_AVG']), //定義FPMI樣式

            AQI_Num = air.AQI, //AQI指數
            AQI_Img = sAQI[0], //AQI指標對應圖
            AQI_Text = air.Status? air.Status: '設備維修', //AQI指標對應文字
            AQI_Class = sAQI[1], //AQI指標對應樣式
            AQI_Icon = '<img class="pull-right" width="40" height="40" src="' + AQI_Img + '.png" alt="狀態' + AQI_Text + '">';

        var FPMI_Num = sFPMI.level, //FPMI指標指數
            FPMI_Text = sFPMI.sign[0], //FPMI指標對應文字
            FPMI_Class = sFPMI.sign[1]; //FPMI指標對應樣式

        /*生成空污資料*/
        $('#LastUpdate').html('最後更新：' + air.PublishTime);
        box
            .find('.title')
            .html(air.SiteName + AQI_Icon);
        box
            .find('#AQI')
            .removeClass()
            .addClass(AQI_Class)
            .html(AQI_Num + ' /<br>' + AQI_Text);
        box
            .find('#FPMI')
            .removeClass()
            .addClass(FPMI_Class)
            .html(FPMI_Num + ' / ' + FPMI_Text);

        /*空氣污染指標(AQI)*/
        function defineAQI(AQI) {
            switch (true) {
                case(AQI > 0 && AQI <= 50):
                    return ['https://imgur.com/BocgzjF', 'status-safe'];
                    break;

                case(AQI > 50 && AQI <= 100):
                    return ['https://imgur.com/nhWDIu2', 'status-normal'];
                    break;

                case(AQI > 100 && AQI <= 150):
                    return ['https://imgur.com/QprwrD7', 'status-warning'];
                    break;

                case(AQI > 150 && AQI <= 200):
                case(AQI > 200 && AQI <= 300):
                    return ['https://imgur.com/nl8fUt2', 'status-danger'];
                    break;
                case(AQI > 300):
                    return ['https://imgur.com/7h7IYCV', 'status-harm'];
                    break;
                default:
                    return ['Fix', 'status-fix'];
                    break;

            }
        }
        /*細懸浮微粒(PM2.5)指標(FPMI)*/
        function defineFPMI(PM25) {
            //PM25為PM2.5平均濃度
            var signArray = [
                [
                    '設備維護', 'status-fix'
                ],
                [
                    '低', 'status-safe'
                ],
                [
                    '中', 'status-normal'
                ],
                [
                    '高', 'status-warning'
                ],
                ['非常高', 'status-danger']
            ];
            if (PM25 > 0 && PM25 <= 11) {
                return {'level': 1, 'sign': signArray[1]};
            } else if (PM25 > 11 && PM25 <= 23) {
                return {'level': 2, 'sign': signArray[1]};
            } else if (PM25 > 23 && PM25 <= 35) {
                return {'level': 3, 'sign': signArray[1]}
            } else if (PM25 > 35 && PM25 <= 41) {
                return {'level': 4, 'sign': signArray[2]}
            } else if (PM25 > 42 && PM25 <= 47) {
                return {'level': 5, 'sign': signArray[2]}
            } else if (PM25 > 47 && PM25 <= 53) {
                return {'level': 6, 'sign': signArray[2]}
            } else if (PM25 > 54 && PM25 <= 58) {
                return {'level': 7, 'sign': signArray[3]}
            } else if (PM25 > 58 && PM25 <= 64) {
                return {'level': 8, 'sign': signArray[3]}
            } else if (PM25 > 64 && PM25 <= 70) {
                return {'level': 9, 'sign': signArray[3]}
            } else if (PM25 > 70) {
                return {'level': 10, 'sign': signArray[4]}
            } else {
                return {'level': 0, 'sign': signArray[0]}
            }
        }

    }
})