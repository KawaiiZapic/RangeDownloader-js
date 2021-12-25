# RangeDownloader-js
用JavaScript实现支持断点续传的下载器

## Compatibility
|Version|Depend|IE|Chrome|Firefox|Safari|
|:-|:-|:-|:-|:-|:-|
|Main|Fetch|No|39+|42+|10.1+|
|Compatible|XHR|10+|39+|42+|10.1+|

## CSDN我操你妈
![CSDN我操你妈](https://user-images.githubusercontent.com/45936772/147377532-53152d3b-87a0-416e-b468-46f030b85870.png)

## Demo
```javascript
let downloader = new RangeDownloader({
  url: "https://local.zapic.moe/test.bin",
  onload: (self) => {
    let res = self.getResultAsBlob();
    let ele = document.createElement("a");
    ele.download = "test.bin";
    ele.href = URL.createObjectURL(res);
    document.body.append(ele);
    ele.click();
    URL.revokeObjectURL(res);
    self.cancel();
  },
  onprogress: (self) => {
    console.log(self.downloadedSize.toString() + " / " + self.totalSize.toString());
  }
});
downloader.start();
setTimeout(()=>{
  downloader.pause();
  setTimeout(()=>{
    downloader.start();
  },1000);
},1000);
```
