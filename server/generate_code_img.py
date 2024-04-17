import cv2
import numpy as np
import sys
line_num = 10

def randomColor():        
    return (np.random.randint(0,255),np.random.randint(0,255),np.random.randint(0,255))
    
def randomChar():
    return chr(np.random.randint(65,90))
    
def randomPos(x_start,x_end,y_start,y_end):
    return (np.random.randint(x_start,x_end),
            np.random.randint(y_start,y_end))
    

def generateImg(img_name,img_height = 60,img_width = 240):
    chars = ""
    #生成一个随机矩阵，randint(low[, high, size, dtype])
    img = np.random.randint(100,200,(img_height,img_width, 3), np.uint8)
    #显示图像
    #cv2.imshow("ranImg",img)
    
    x_pos = 0
    y_pos = 25
    for i in range(4):
        char = randomChar()
        chars += char
        cv2.putText(img,char,
                    (np.random.randint(x_pos,x_pos + 50),np.random.randint(y_pos,y_pos + 35)), 
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1.5,
                    randomColor(),
                    2,
                    cv2.LINE_AA)
        x_pos += 45
    
    #添加线段
    for i in range(line_num):
        img = cv2.line(img,
                       randomPos(0,img_width,0,img_height),
                       randomPos(0,img_width,0,img_height),
                        randomColor(),
                        np.random.randint(1,2))
    cv2.imwrite(sys.path[0] +'/static/' + img_name + ".png",img)
    return chars
    # cv2.waitKey(0)                  
    #cv2.destroyAllWindows()
