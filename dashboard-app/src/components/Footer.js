const Footer = () => {
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
            <div class="footer" style={{position: 'fixed', bottom: 0}}>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                            {/* Copyright © 2024 Softworks. All rights reserved. Powered by Softworks <a href="https://colorlib.com/wp/">Softworks</a>. */}
                            <a href="https://www.softworkscapital.com/">Copyright © 2024 Softworks. Powered by Softworks.</a>
                        </div>
                        <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                            <div class="text-md-right footer-links d-none d-sm-block">
                                <a href="https://www.softworkscapital.com/">About</a>
                                <a href="https://www.softworkscapital.com/">Support</a>
                                <a href="https://www.softworkscapital.com/">Contact Us</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;