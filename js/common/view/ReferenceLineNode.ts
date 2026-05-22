// Copyright 2026, University of Colorado Boulder

/**
 * ReferenceLine is the view for the reference line, a vertical line that connects the same x-coordinate in all graphs.
 * The x-coordinate is changed by dragging a handle left and right. Origin is at the center of the handle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
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
import ReferenceLineDescriber from './description/ReferenceLineDescriber.js';
import { HomeEndKeyboardListener } from './HomeEndKeyboardListener.js';
import ReferenceLineDragListener from './ReferenceLineDragListener.js';
import ReferenceLineReadValuesListener from './ReferenceLineReadValuesListener.js';

type SelfOptions = {

  // Length of the vertical line, in view coordinates.
  lineLength: number;
};

type ReferenceLineNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class ReferenceLineNode extends Node {

  public static readonly HANDLE_DIAMETER = 18;

  public constructor( referenceLine: ReferenceLine,
                      describer: ReferenceLineDescriber,
                      chartTransform: ChartTransform,
                      providedOptions: ReferenceLineNodeOptions ) {

    affirm( providedOptions.lineLength > 0, `lineLength must be > 0: ${providedOptions.lineLength}` );

    // Spherical handle that can be dragged left and right to change the x-coordinate of the reference line.
    const handleNode = new ReferenceLineHandleNode( referenceLine, describer, chartTransform,
      providedOptions.tandem.createTandem( 'handleNode' ) );

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

  private readonly describer: ReferenceLineDescriber;

  public constructor( referenceLine: ReferenceLine,
                      describer: ReferenceLineDescriber,
                      chartTransform: ChartTransform,
                      tandem: Tandem ) {

    const options = combineOptions<ShadedSphereNodeOptions>( {}, AccessibleInteractiveOptions, {
      isDisposable: false,
      cursor: 'ew-resize',
      mainColor: QBSColors.referenceLineHandleColorProperty,

      // As in Calculus Grapher, see https://github.com/phetsims/calculus-grapher/issues/405#issuecomment-4185183008.
      accessibleRoleDescription: QuantumBoundStatesFluent.a11y.referenceLine.accessibleRoleDescriptionStringProperty,
      tandem: tandem
    } );

    super( ReferenceLineNode.HANDLE_DIAMETER, options );

    this.describer = describer;

    // Drag listeners for all forms of input.
    this.addInputListener( new ReferenceLineDragListener( this, referenceLine.xProperty, chartTransform, tandem ) );

    // Keyboard listener for shortcuts.
    this.addInputListener( new HomeEndKeyboardListener( referenceLine.xProperty, {
      homeCallback: () => this.describeMoved(),
      endCallback: () => this.describeMoved(),
      tandem: tandem.createTandem( 'homeEndKeyboardListener' )
    } ) );

    this.addInputListener( new ReferenceLineReadValuesListener( this, tandem.createTandem( 'readValuesListener' ) ) );

    // Center the handle on the x-coordinate of the reference line.
    referenceLine.xProperty.link( x => {
      this.centerX = chartTransform.modelToViewX( x );
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
  public describeFocused(): void {
    this.addAccessibleFocusObjectResponse( this.describer.getAccessibleObjectResponse() );
  }

  /**
   * Adds an accessible response when the handle is moved.
   */
  public describeMoved(): void {
    this.addAccessibleObjectResponse( this.describer.getAccessibleObjectResponse(), {
      interruptible: true,
      alertDelay: 1000
    } );
  }
}
