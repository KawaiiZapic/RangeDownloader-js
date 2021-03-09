# RangeDownloader-js
用JavaScript实现支持断点续传的下载器

## Compatibility
|Version|IE|Chrome|Firefox|Safari|
|:-|:-|:-|:-|:-|
|Main|No|39+|42+|10.1+|
|Compatibility|10+|39+|42+|10.1+|
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
