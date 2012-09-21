=======
vorkNode
========

vorkNode by Bradley Matusiak       

    bmatusiak@ gmail.com
    
    <a herf="http://vorknode.herokuapp.com/">http://vorknode.herokuapp.com/</a>
    
## Installation and Usage

Requirements:

  * NodeJS `>= 0.6.15`
  * NPM `>= 1.1.16`

Install:

     get clone git://github.com/bmatusiak/vorkNode.git
     cd vorkNode
     npm install
    
## License

The GPL version 3, read it at [http://www.gnu.org/licenses/gpl.txt](http://www.gnu.org/licenses/gpl.txt)
## inspirational port
    http://vork.us/
----------
##Parse Order
      (controler_only)    ____________               ____________
        |           |    |           |     *|   |----|           |
        |   model   |--->| controler |      |   |    |  elements |
        |___________|    |___________|      |   |    |____(ejs)__|
                                |           |   |
                         _______V_____      |   |     ____________
                         |           |      |   |    |           |
                         |   view    |      |---|----|  helpers  |
                         |____(ejs)__|--    |   |    |___________|
                                |       \   |   |
                         _______V_____  \   |   |      ____________
                         |           |  \   |   |    |           |
                         |   layout  |  \   |   |    |  vorkNode |
                         |____(ejs)__|  \   |   |----|  objects  |
                                |       \  *|        |___________|
                         _______V_____  \
                         |           |<-\
                         |   ouput   |
                         |___________|                            
