<script setup lang="ts">
import { onMounted, ref } from 'vue';
const step = ref(5);
const gpx = ref(''); // 用 ref 定义响应式数据
const targte = ref(''); // 用 ref 定义响应式数据
const onSubmit = () => {
    const str = gpx.value;
    parseXmlData(str); // 将 gpx 内容传递给 test 函数
};
/**
 * 	<gx:FlyTo>
            <gx:duration>3</gx:duration>
            <LookAt>
                <TimeSpan>
                    <begin>2024-11-04T18:28:00Z</begin>
                    <end>2024-11-04T18:28:00Z</end>
                </TimeSpan>
                <longitude>116.272518</longitude>
                <latitude>39.84434</latitude>
                <altitude>48.38</altitude>
                <heading>280.4886779785156</heading>
                <tilt>60</tilt>
                <range>50000</range>
            </LookAt>
        </gx:FlyTo>
 */
type FlyTo = {
    duration: string,
    LookAt: {
        TimeSpan: {
            begin: string,
            end: string
        },
        longitude: string,
        latitude: string,
        altitude: string,
        heading: string,
        tilt: string,
        range: string
    }
}

const parseXmlData = (xmlData: string) => {
    let data: FlyTo[] = []
    const parser = new DOMParser();
    const xmlDoc: Document = parser.parseFromString(xmlData, 'application/xml');
    // 检查 XML 是否解析出错
    const parserError = xmlDoc.getElementsByTagName("parsererror")
    if (parserError.length) {
        console.error('Error parsing XML:', parserError[0].textContent);
    } else {
        const flyTos = xmlDoc.getElementsByTagName("gx:FlyTo")
        for (let index = 1; index < flyTos.length; index++) {
            const item = flyTos[index];
            data.push(
                {
                    duration: item.getElementsByTagName("gx:duration")[0].textContent as string,
                    LookAt: {
                        TimeSpan: {
                            begin: item.getElementsByTagName("begin")[0].textContent as string,
                            end: item.getElementsByTagName("end")[0].textContent as string
                        },
                        longitude: item.getElementsByTagName("longitude")[0].textContent as string,
                        latitude: item.getElementsByTagName("latitude")[0].textContent as string,
                        altitude: item.getElementsByTagName("altitude")[0].textContent as string,
                        heading: item.getElementsByTagName("heading")[0].textContent as string,
                        tilt: item.getElementsByTagName("tilt")[0].textContent as string,
                        range: item.getElementsByTagName("range")[0].textContent as string
                    }
                }
            )
        }
    }

    generateXml(data)
}

const generateTime = (str: string) => {
    const milliseconds = Date.parse(str) - (step.value * 1000)
    return new Date(milliseconds).toISOString()
}
const generateXml = (data: FlyTo[]) => {
    const prefix = `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom"><gx:Tour kml:id="_0"><name>ca</name><gx:Playlist>`
    const stuff = `</gx:Playlist></gx:Tour></kml>`
    let res = ''
    data.forEach((x: FlyTo) => {
        res = res.concat(`<gx:FlyTo><gx:duration>${x.duration}</gx:duration><gx:flyToMode>smooth</gx:flyToMode><LookAt><TimeSpan><begin>${generateTime(x.LookAt.TimeSpan.end)}</begin><end>${x.LookAt.TimeSpan.end}</end></TimeSpan><longitude>${x.LookAt.longitude}</longitude><latitude>${x.LookAt.latitude}</latitude><altitude>${x.LookAt.altitude}</altitude><heading>${x.LookAt.heading}</heading><tilt>${x.LookAt.tilt}</tilt><range>${x.LookAt.range}</range></LookAt></gx:FlyTo>`)
    })

    targte.value = prefix + res + stuff
}


onMounted(() => {
})

</script>

<template>
    <div class="notfound-page">
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field name="stepper" label="线段长度">
                    <template #input>
                        <van-stepper v-model="step" />
                    </template>
                </van-field>
            </van-cell-group>
            <van-cell-group inset style="margin-top: 20px;">
                <van-field v-model="gpx" label-align="top" label="原始GPX数据" rows="10" type="textarea"
                    placeholder="输入gpx文本内容" />
            </van-cell-group>
            <van-cell-group inset style="margin-top: 20px;">
                <van-field v-model="targte" label-align="top" label="转换之后的结果" rows="10" type="textarea"
                    placeholder="输出gpx文本内容" />
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button round block type="primary" native-type="submit">
                    转换
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<style lang="scss" scoped>
.notfound-page {
    padding: 20px 0;
    background-color: #dededf;
}

.tbox {
    width: 100vw;
    height: 100vh;
    overflow: scroll;
    overflow-y: auto;
    /* 必须允许滚动 */
    border: 1px solid #369;
    background-color: cde;
    position: relative;

    .top {
        position: sticky;
        top: 0;
        background-color: #f8f9fa;
        width: 100%;
        z-index: 1;
    }
}
</style>
