// Copyright 2026, University of Colorado Boulder

/**
 * ReferenceLine is the view for the reference line, a vertical line that connects the same x-coordinate in all graphs.
 * The x-coordinate is changed by dragging a handle left and right. Origin is at the center of the handle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import AccessibleInteractiveOptions from '../../../../scenery-phet/js/accessibility/AccessibleInteractiveOptions.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import ReferenceLine from '../model/ReferenceLine.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import { HomeEndKeyboardListener } from './HomeEndKeyboardListener.js';
import ReferenceLineDragListener from './ReferenceLineDragListener.js';

type SelfOptions = {

  // Length of the vertical line, in view coordinates.
  lineLength: number;
};

type ReferenceLineNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class ReferenceLineNode extends Node {

  public static readonly HANDLE_DIAMETER = 18;

  public constructor( referenceLine: ReferenceLine,
                      chartTransform: ChartTransform,
                      providedOptions: ReferenceLineNodeOptions ) {

    affirm( providedOptions.lineLength > 0, `lineLength must be > 0: ${providedOptions.lineLength}` );

    // Spherical handle that can be dragged left and right to change the x-coordinate of the reference line.
    const handleNode = new ReferenceLineHandleNode( referenceLine, chartTransform, providedOptions.tandem.createTandem( 'handleNode' ) );

    // Vertical line that passes through all graphs.
    const verticalLine = new Line( 0, -providedOptions.lineLength, 0, 0, {
      stroke: QBSColors.referenceLineStrokeProperty,
      lineWidth: QBSConstants.REFERENCE_LINE_LINE_WIDTH,
      pickable: false // optimization
    } );

    // Keep the vertical line centered on the handle.
    handleNode.boundsProperty.link( bounds => {
      verticalLine.centerX = bounds.centerX;
    } );

    const options = optionize<ReferenceLineNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      children: [ verticalLine, handleNode ],
      visibleProperty: referenceLine.visibleProperty,
      accessibleHeading: QuantumBoundStatesFluent.a11y.referenceLine.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.referenceLine.accessibleHelpTextStringProperty
    }, providedOptions );

    super( options );
  }
}

/**
 * ReferenceLineHandleNode is the interactive part of the reference line. It can be dragged horizontally.
 */
export class ReferenceLineHandleNode extends InteractiveHighlighting( ShadedSphereNode ) {

  private readonly referenceLine: ReferenceLine;

  public constructor( referenceLine: ReferenceLine, chartTransform: ChartTransform, tandem: Tandem ) {

    const options = combineOptions<ShadedSphereNodeOptions>( {}, AccessibleInteractiveOptions, {
      isDisposable: false,
      cursor: 'ew-resize',
      mainColor: QBSColors.referenceLineHandleColorProperty,

      // As in Calculus Grapher, see https://github.com/phetsims/calculus-grapher/issues/405#issuecomment-4185183008.
      accessibleRoleDescription: QuantumBoundStatesFluent.a11y.referenceLine.accessibleRoleDescriptionStringProperty,
      tandem: tandem
    } );

    super( ReferenceLineNode.HANDLE_DIAMETER, options );

    this.referenceLine = referenceLine;

    // Initial position in model coordinates. y-value can be anything because movement is constrained to horizontal.
    const positionProperty = new Property( new Vector2( referenceLine.xProperty.value, 0 ) );

    // Drag listeners for all forms of input.
    this.addInputListener( new ReferenceLineDragListener( this, referenceLine.xProperty,
      positionProperty, referenceLine.xProperty.range, chartTransform, tandem ) );

    // Keyboard listener for shortcuts.
    this.addInputListener( new HomeEndKeyboardListener( referenceLine.xProperty, {
      homeCallback: () => this.describeMoved(),
      endCallback: () => this.describeMoved(),
      tandem: tandem.createTandem( 'keyboardListener' )
    } ) );

    // Center the handle on the x-coordinate of the reference line.
    referenceLine.xProperty.link( x => {
      this.centerX = chartTransform.modelToViewX( x );
      positionProperty.value = new Vector2( x, 0 );
    } );

    //TODO replace with accessibleFocusObjectResponse option?
    this.focusedProperty.lazyLink( focused => {
      focused && this.describeFocused();
    } );

    this.mouseArea = this.localBounds.dilatedXY( 3, 3 );
    this.touchArea = this.localBounds.dilatedXY( 5, 5 );
  }

  /**
   * Adds an accessible response when the handle gets focus.
   */
  private describeFocused(): void {
    const response = QuantumBoundStatesFluent.a11y.referenceLine.accessibleFocusObjectResponse.format( {
      x: toFixed( this.referenceLine.xProperty.value, QBSConstants.X_DECIMAL_PLACES )
    } );
    this.addAccessibleFocusObjectResponse( response );
  }

  /**
   * Adds an accessible response when the handle is moved.
   */
  public describeMoved(): void {
    const response = QuantumBoundStatesFluent.a11y.referenceLine.accessibleObjectResponse.format( {
      x: toFixed( this.referenceLine.xProperty.value, QBSConstants.X_DECIMAL_PLACES )
    } );
    this.addAccessibleObjectResponse( response, {
      interruptible: true,
      alertDelay: 1000
    } );
  }
}
