const TopNav = () => {

    const username = localStorage.getItem('userName');
    const companyname = localStorage.getItem('companyname');

    return (
        <div>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <title>Concept - Bootstrap 4 Admin Dashboard Template</title>
                <link rel="stylesheet" href="../assets/vendor/bootstrap/css/bootstrap.min.css" />
                <link href="../assets/vendor/fonts/circular-std/style.css" rel="stylesheet" />
                <link rel="stylesheet" href="../assets/libs/css/style.css" />
                <link rel="stylesheet" href="../assets/vendor/fonts/fontawesome/css/fontawesome-all.css" />
            </head>
            <body>

                
                <div class="dashboard-header">
                    <nav class="navbar navbar-expand-lg bg-white fixed-top " align='left'>
                        <a  href="../menu"><p class="navbar-brand">REMS ECOSYSTEM </p> <p style={{marginTop: '-40px',marginLeft: '20px'}}>Logged in as: {username}{companyname}</p></a>
                       
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        
                                    <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                            <ul class="navbar-nav ml-auto navbar-right-top">
                                <li class="nav-item">
                                    <div id="custom-search" class="top-search-bar">
                                        <input class="form-control" type="text" placeholder="Search.." />
                                    </div>
                                </li>
                                
                               

                                
                                <li class="nav-item dropdown connection">
                                    <a class="nav-link" href="/menu" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <img src="../assets/images/menu.png" alt=""   class="user-avatar-md rounded-circle" /> </a>
                                    <ul class="dropdown-menu dropdown-menu-right connection-dropdown">
                                    </ul>
                                </li>
                                <li class="nav-item dropdown nav-user">
                                    <a class="nav-link nav-user-img" href="/" id="navbarDropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="../assets/images/logout.png" alt="" class="user-avatar-md rounded-circle" /></a>
                                    <div class="dropdown-menu dropdown-menu-right nav-user-dropdown" aria-labelledby="navbarDropdownMenuLink2">
                                        <div class="nav-user-info">
                                            <h5 class="mb-0 text-white nav-user-name">
                                                John Abraham</h5>
                                            <span class="status"></span><span class="ml-2">Available</span>
                                        </div>
                                        <a class="dropdown-item" href="0"><i class="fas fa-user mr-2"></i>Account</a>
                                        <a class="dropdown-item" href="0"><i class="fas fa-cog mr-2"></i>Setting</a>
                                        <a class="dropdown-item" href="0"><i class="fas fa-power-off mr-2"></i>Logout</a>
                                    </div>
                                </li>
                            </ul>
                        </div>        
                    
        
                    </nav>
                </div>
            </body>
        </div>
    );
}

export default TopNav;