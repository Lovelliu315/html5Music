var gulp = require("gulp");
var imagemin = require("gulp-imagemin");
var newer = require("gulp-newer");
var htmlClean = require("gulp-htmlclean");
var uglify = require("gulp-uglify");
var stripDebug = require("gulp-strip-debug");
var concat = require("gulp-concat");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var connect = require("gulp-connect");  //开启服务器
//var livereload = require("gulp-livereload"); //自动刷新

var devMode = process.env.NODE_ENV; //判断开发环境还是生产环境

var folder = {
	src: './src/',  //开发目录文件夹
	build: './build/'  //打包后目录文件夹
}


//gulp.src() : 读文件
//gulp.dest() :写文件
//gulp.task(): 创建任务
//gulp.watch(): 监听
//gulp.pipe(): 传输
gulp.task("images", function(done){
	gulp.src(folder.src + "images/*")  //读取文件
		.pipe(newer(folder.build + "images")) //检测是否是一个新文件
		.pipe(connect.reload())
		.pipe(imagemin())		//image压缩
		.pipe(gulp.dest(folder.build + "images")); //传输文件
	done();
})

gulp.task("js", function(done){
	var page = gulp.src(folder.src + "js/*").pipe(connect.reload());
	if(!devMode){
		//page.pipe(concat("main.js"))  //js文件拼接
		page.pipe(stripDebug())  //去掉调试语句
		page.pipe(uglify())			//js压缩
		
	}
	page.pipe(gulp.dest(folder.build + "js"));
	done();
})

gulp.task("css", function(done){
	var options = [autoprefixer(), cssnano()];
	var page = gulp.src(folder.src + "css/*").pipe(less()).pipe(connect.reload())	//less编译成css;
	if(!devMode){
		page.pipe(postcss(options))
	}
	page	.pipe(gulp.dest(folder.build + "css"));
	done();
})

//gulp.series：按照顺序执行
//gulp.parallel：可以并行计算
gulp.task("html", function(done){
	var page = gulp.src(folder.src + "html/*").pipe(connect.reload());
	if(!devMode){
		page.pipe(htmlClean())			//html压缩	
	}
	page.pipe(gulp.dest(folder.build + "html"));	
	done();
})

gulp.task("watch", function(){
	gulp.watch('src/html/*',gulp.series('html'));
    gulp.watch('src/css/*' ,gulp.series('css'));
    gulp.watch('src/js/*' ,gulp.series('js'));
	gulp.watch('src/images/*' ,gulp.series('images'));

})

gulp.task("server", function(){
	connect.server({
		port: "8090",
		livereload: true
	});
})

//执行默认任务
gulp.task("default", gulp.parallel("html", "images", "js", "css", "watch","server", function(){
	
}));  