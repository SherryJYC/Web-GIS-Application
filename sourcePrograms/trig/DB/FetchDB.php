<?php  
	
	$N0 = 819069.8;
	$E0 = 836694.05;
	$lambda0 = deg2rad(DegToNum(22,18,43.68));
	$theta0 = deg2rad(DegToNum(114, 10, 42.8));
	$m0 = 1;
	$M0 = 2468395.723;
	$Vs = 6381480.5;
	$Ps = 6359840.76;
	$Ws = 1.003402560;
	$a = 6378388;

	$e2 = 6.722670022*pow(10,-3);
	$e4 = pow($e2,2);

	$A0 = 1 - $e2/4 - 3*$e4/64;
	$A2 = 3/8 * ($e2+$e4/4);
	$A4 = 15/256*$e4;

	$M1 = $a*($A0*$lambda0 - $A2*sin(2*$lambda0) + $A4*sin(4*$lambda0));
	
	function DegToNum($degree, $minute, $second){
		return $degree + $minute/60 + $second/3600;
	}
	function NumToDeg($number){
		$deg = floor($number);
		$min = floor(($number - $degree) * 60);
		$sec = floor(($number - $degree - $minute/60) * 3600);
		return $deg . "-" . $min . "-" . $sec;
	}

	function getWGS84($N, $E){
		global $N0, $E0;
		$difN = $N - $N0;
		$difE = $E - $E0;
		
		$LambdaP = getLambdaP($difN);

		$VP = getVP($LambdaP);
		$PP = getPP($LambdaP);
		$WP = getWP($LambdaP);
		$TP = getTP($LambdaP);

		$theta = getTheta($LambdaP, $difE, $VP, $WP, $TP);
		$theta = rad2deg($theta);
		$theta = $theta + 8.8 / 3600;

		$lambda = getLambda($LambdaP, $difE, $TP, $PP, $VP);
		$lambda = rad2deg($lambda);
		$lambda = $lambda - 5.5 / 3600;

		$returnWGS = array($theta, $lambda);
		return $returnWGS;
	}

	function getTheta($LambdaP, $difE, $VP, $WP, $TP){
		global $theta0, $m0;
		$secLambdaP = 1/cos($LambdaP);
		$part1 = $theta0;
		$part2 = $secLambdaP * ($difE/($m0 * $VP));
		$part3Sub1 = $secLambdaP;
		$part3Sub2 = pow($difE,3) / (6 * pow($m0*$VP,3));
		$part3Sub3 = $WP + 2 * pow($TP,2);
		$part3 = $part3Sub1 * $part3Sub2 * $part3Sub3;

		return $part1 + $part2 - $part3;
	}

	function getLambda($LambdaP, $difE, $TP, $PP, $VP){
		global $m0;
		$part1 = $LambdaP;
		$part2Sub1 = $TP / ($m0 * $PP);
		$part2Sub2 = pow($difE,2) / (2 * $m0 * $VP);
		$part2 = $part2Sub1 * $part2Sub2;

		return $part1 - $part2 ;
	}

	function getTP($LambdaP){
		return tan($LambdaP);
	}

	function getVP($LambdaP){
		global $a, $e2;
		return $a /pow((1 - $e2 * pow(sin($LambdaP),2)),0.5);
	}

	function getPP($LambdaP){
		global $a, $e2;
		$part1 = $a * (1 - $e2);
		$part2 = pow(1 - $e2 * pow(sin($LambdaP),2),1.5);
		
		return $part1/$part2;
	}

	function getWP($LambdaP){
		return getVP($LambdaP) /getPP($LambdaP);
	}

	function getLambdaP($difN){
		global $M1, $m0;
		$M = ($difN + $M1)/$m0;
		$x0 = 22;
		$tolerance = 0.000000000001;
		$foundSolution = 0;
		$i = 0;
		for ($i = 0 ; $i < 10000 ; $i++){
			$y = MFunction($x0, $M);
			$yPrime = MPrimeFunction($x0);
			$x1 = $x0 - $y/$yPrime;

			if(abs($x1 - $x0)/abs($x1) < $tolerance){
				$foundSolution = 1;
				break;
			}
			$x0 = $x1;				
		}
		return $x1;
	}

	function MFunction($lambdaP,$M){
		global $A0, $A2, $A4, $a;
		$part1 = $A0*$lambdaP;
		$part2 = $A2*sin(2*$lambdaP);
		$part3 = $A4*sin(4*$lambdaP);

		return $a * ($part1 - $part2 + $part3) - $M;
	}

	function MPrimeFunction($lambdaP){
		global $a, $A0, $A2, $A4;
		$part1 = $A0;
		$part2 = (2) * $A2 * cos(2*$lambdaP);
		$part3 = 4 * $A4 * cos(4*$lambdaP);

		return $a * ($part1 - $part2+$part3);

	}

	function degsin($degree){
		return sin(deg2rad($degree));
	}
	function degcos($degree){
		return cos(deg2rad($degree));
	}
	function degtan($degree){
		return tan(deg2rad($degree));
	}
	
$dir = 'sqlite:HK_Trig.sqlite';
$dbh  = new PDO($dir) or die("cannot open the database");
$query = "SELECT * from HKTRIG;";
$Result = $dbh->query($query);
	$i=0;
foreach ($Result as $row)
{
		$getWGS = getWGS84($row[2], $row[3]);
		$arr = array('id' => $row[0], 'name' => $row[1], 'lat' => $getWGS[1], 'long' => $getWGS[0], 'height' => $row[4]);

		if ($i==0)
			$json_array = json_encode ($arr);
		else
			$json_array = $json_array.','.json_encode ($arr);
		$i++;
}

	$json_array = "[" . $json_array."]";
	echo $json_array;
	
?>	
